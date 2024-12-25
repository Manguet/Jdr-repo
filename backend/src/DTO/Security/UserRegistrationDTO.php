<?php

namespace App\DTO\Security;

use Symfony\Component\Validator\Constraints as Assert;

readonly class UserRegistrationDTO
{
    public function __construct(
        #[Assert\NotBlank]
        #[Assert\Email]
        public string $email,

        #[Assert\NotBlank]
        public string $username,

        #[Assert\NotBlank]
        #[Assert\Length(min: 8)]
        public string $password,
    ) {
    }
}
