<?php

namespace App\Controller\User;

use App\Entity\User;
use App\Services\Security\JWTService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class UserController extends AbstractController
{
    public function __construct(
        private readonly JWTService $jwtService,
        private readonly EntityManagerInterface $entityManager
    ) {
    }

    #[Route('/api/user/me', name: 'api_user_me', methods: ['GET', 'OPTIONS'])]
    public function me(Request $request): JsonResponse
    {
        try {
            // Récupérer le JWT du cookie
            $token = $request->cookies->get('JWT');

            if (!$token) {
                return $this->json([
                    'message' => 'No token provided'
                ], Response::HTTP_UNAUTHORIZED);
            }

            // Décoder et vérifier le JWT
            $payload = $this->jwtService->decode($token);

            if (!isset($payload['user']['id'])) {
                return $this->json([
                    'message' => 'Invalid token format'
                ], Response::HTTP_UNAUTHORIZED);
            }

            // Récupérer l'utilisateur depuis la base de données
            $user = $this->entityManager->getRepository(User::class)->find($payload['user']['id']);

            if (!$user) {
                return $this->json([
                    'message' => 'User not found'
                ], Response::HTTP_UNAUTHORIZED);
            }

            // Retourner les informations de l'utilisateur
            return $this->json([
                'user' => [
                    'id' => $user->getId(),
                    'email' => $user->getEmail(),
                    'username' => $user->getUsername(),
                    'roles' => $user->getRoles()
                ]
            ]);

        } catch (\Exception $e) {
            return $this->json([
                'message' => 'An error occurred: ' . $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
