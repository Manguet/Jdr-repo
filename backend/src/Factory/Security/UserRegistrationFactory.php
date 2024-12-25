<?php

namespace App\Factory\Security;

use App\DTO\Security\UserRegistrationDTO;
use App\Entity\User;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class UserRegistrationFactory
{
    public function __construct(
        private readonly UserPasswordHasherInterface $passwordHasher
    ) {
    }

    public function createFromRegistrationDTO(UserRegistrationDTO $dto): User
    {
        $user = new User();
        $user->setEmail($dto->email);
        $user->setUsername($dto->username);
        $user->setPassword(
            $this->passwordHasher->hashPassword(
                $user,
                $dto->password
            )
        );

        $user->setRoles(['ROLE_USER']);

        return $user;
    }
}
