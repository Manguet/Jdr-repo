<?php

namespace App\Controller\Security;

use App\Entity\User;
use App\Services\Security\JWTService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Cookie;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Attribute\Route;

class SecurityController extends AbstractController
{
    public function __construct(
        private readonly EntityManagerInterface $entityManager,
        private readonly UserPasswordHasherInterface $passwordHasher,
        private readonly JWTService $jwtService
    ) {
    }

    #[Route('/api/login', name: 'api_login', methods: ['POST'])]
    public function login(Request $request): JsonResponse
    {
        try {
            $data = json_decode($request->getContent(), true, 512, JSON_THROW_ON_ERROR);

            if (!isset($data['email'], $data['password'])) {
                return $this->json([
                    'message' => 'Email and password are required'
                ], Response::HTTP_BAD_REQUEST);
            }

            $user = $this->entityManager->getRepository(User::class)->findOneBy(['email' => $data['email']]);

            if (!$user) {
                return $this->json([
                    'message' => 'Invalid credentials'
                ], Response::HTTP_UNAUTHORIZED);
            }

            if (!$this->passwordHasher->isPasswordValid($user, $data['password'])) {
                return $this->json([
                    'message' => 'Invalid credentials'
                ], Response::HTTP_UNAUTHORIZED);
            }

            $jwt = $this->jwtService->createJWT($user);

            $response = $this->json([
                'message' => 'Login successful',
                'user' => [
                    'id' => $user->getId(),
                    'email' => $user->getEmail(),
                    'username' => $user->getUsername()
                ]
            ]);

            $response->headers->setCookie(
                new Cookie(
                    'JWT',
                    $jwt,
                    time() + (24 * 60 * 60),
                    '/',
                    null,
                    true,
                    true,
                    false,
                    'Strict'
                )
            );

            return $response;

        } catch (\Exception) {
            return $this->json([
                'message' => 'An error occurred during login'
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    #[Route('/api/logout', name: 'api_logout', methods: ['POST'])]
    public function logout(): JsonResponse
    {
        $response = new JsonResponse([
            'message' => 'Logged out successfully'
        ]);

        $response->headers->setCookie(
            new Cookie(
                'JWT',
                null,
                1,
                '/',
                null,
                true,
                true,
                false,
                'Strict'
            )
        );

        return $response;
    }
}
