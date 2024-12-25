<?php

namespace App\Controller\Registration;

use App\DTO\Security\UserRegistrationDTO;
use App\Factory\Security\UserRegistrationFactory;
use App\Services\Security\JWTService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Cookie;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\Routing\Attribute\Route;

class RegistrationController extends AbstractController
{
    public function __construct(
        private readonly UserRegistrationFactory $userFactory,
        private readonly EntityManagerInterface $entityManager,
        private readonly JWTService $jwtService
    ) {
    }

    #[Route('/api/register', name: 'api_register', methods: ['POST'])]
    public function register(
        #[MapRequestPayload] UserRegistrationDTO $userDTO
    ): JsonResponse {
        try {
            $user = $this->userFactory->createFromRegistrationDTO($userDTO);

            $this->entityManager->persist($user);
            $this->entityManager->flush();

            $jwt = $this->jwtService->createJWT($user);

            $response = new JsonResponse([
                'message' => 'User registered successfully',
                'token' => $jwt,
                'user' => [
                    'id' => $user->getId(),
                    'email' => $user->getEmail(),
                    'username' => $user->getUsername(),
                ]
            ]);

            // Configurer le cookie HTTP-only avec le JWT
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

        } catch (\Exception $e) {
            return $this->json([
                'error' => 'Registration failed',
                'message' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
