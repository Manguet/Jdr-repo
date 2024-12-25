import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from '../api/axios';
import './RegistrationForm.css';

export const RegistrationForm = () => {
    const { register: signup, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        setError
    } = useForm({
        mode: 'onChange'
    });

    const password = watch('password');

    const onSubmit = async (data) => {
        try {
            await signup(data);
            navigate('/dashboard');
        } catch (error) {
            console.error('Registration error:', error);
            if (error.response?.status === 400) {
                Object.keys(error.response.data.errors).forEach(key => {
                    setError(key, {
                        type: 'manual',
                        message: error.response.data.errors[key]
                    });
                });
            }
        }
    };

    React.useEffect(() => {
        if (isAuthenticated) {
            navigate('/dashboard');
        }
    }, [isAuthenticated, navigate]);

    return (
        <section className="container sectionTop registration">
            <h1 className="gradientText">Commencez votre légende</h1>

            <div className="registration_container">
                <form className="registration_form" onSubmit={handleSubmit(onSubmit)}>
                    <div className="form-group">
                        <input
                            type="text"
                            id="username"
                            placeholder=" "
                            {...register("username", {
                                required: "Le nom d'utilisateur est requis",
                                minLength: {
                                    value: 3,
                                    message: "Le nom d'utilisateur doit contenir au moins 3 caractères"
                                }
                            })}
                            className={errors.username ? 'error' : ''}
                        />
                        <label htmlFor="username">Nom d'utilisateur *</label>
                        {errors.username && (
                            <span className="error-message">{errors.username.message}</span>
                        )}
                    </div>

                    <div className="form-group">
                        <input
                            type="email"
                            id="email"
                            placeholder=" "
                            {...register("email", {
                                required: "L'adresse e-mail est requise",
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: "Adresse e-mail invalide"
                                }
                            })}
                            className={errors.email ? 'error' : ''}
                        />
                        <label htmlFor="email">Adresse e-mail *</label>
                        {errors.email && (
                            <span className="error-message">{errors.email.message}</span>
                        )}
                    </div>

                    <div className="form-group">
                        <input
                            type="password"
                            id="password"
                            placeholder=" "
                            {...register("password", {
                                required: "Le mot de passe est requis",
                                minLength: {
                                    value: 8,
                                    message: "Le mot de passe doit contenir au moins 8 caractères"
                                }
                            })}
                            className={errors.password ? 'error' : ''}
                        />
                        <label htmlFor="password">Mot de passe *</label>
                        {errors.password && (
                            <span className="error-message">{errors.password.message}</span>
                        )}
                    </div>

                    <div className="form-group">
                        <input
                            type="password"
                            id="passwordConfirm"
                            placeholder=" "
                            {...register("passwordConfirm", {
                                required: "La confirmation du mot de passe est requise",
                                validate: value =>
                                    value === password || "Les mots de passe ne correspondent pas"
                            })}
                            className={errors.passwordConfirm ? 'error' : ''}
                        />
                        <label htmlFor="passwordConfirm">Confirmer le mot de passe *</label>
                        {errors.passwordConfirm && (
                            <span className="error-message">{errors.passwordConfirm.message}</span>
                        )}
                    </div>

                    <button type="submit">S'inscrire</button>
                </form>
            </div>
        </section>
    );
};
