<?php

namespace App\Services\Security;

use App\Entity\User;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;

readonly class JWTService
{
    public function __construct(
        private ParameterBagInterface $params
    ) {
    }

    public function createJWT(User $user): string
    {
        $payload = [
            "user" => [
                "id" => $user->getId(),
                "email" => $user->getEmail(),
                "username" => $user->getUsername(),
                "roles" => $user->getRoles()
            ],
            "iat" => time(),
            "exp" => time() + (24 * 60 * 60)
        ];

        return JWT::encode(
            $payload,
            $this->params->get('jwt_secret'),
            'HS256'
        );
    }

    public function decode(string $token): array
    {
        try {
            $decoded = JWT::decode(
                $token,
                new Key($this->params->get('jwt_secret'), 'HS256')
            );

            // Convertir l'objet stdClass en array
            return json_decode(json_encode($decoded), true);

        } catch (\Exception $e) {
            throw new \RuntimeException('Invalid token: ' . $e->getMessage());
        }
    }

    public function isValid(string $token): bool
    {
        try {
            $this->decode($token);
            return true;
        } catch (\Exception) {
            return false;
        }
    }
}
