import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const LoginForm = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        setError
    } = useForm({
        mode: 'onChange'
    });

    const { login } = useAuth();
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        try {
            await login(data.email, data.password);
            navigate('/characters');
        } catch (error) {
            console.error('Login error:', error);
            if (error.status === 401) {
                setError('email', {
                    type: 'manual',
                    message: 'Email ou mot de passe incorrect'
                });
                setError('password', {
                    type: 'manual',
                    message: 'Email ou mot de passe incorrect'
                });
            } else {
                setError('email', {
                    type: 'manual',
                    message: 'Une erreur est survenue'
                });
            }
        }
    };

    return (
        <section className="container sectionTop registration">
            <h1 className="gradientText">Connectez-vous à votre compte</h1>

            <div className="registration_container">
                <form className="registration_form" onSubmit={handleSubmit(onSubmit)}>
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
                                required: "Le mot de passe est requis"
                            })}
                            className={errors.password ? 'error' : ''}
                        />
                        <label htmlFor="password">Mot de passe *</label>
                        {errors.password && (
                            <span className="error-message">{errors.password.message}</span>
                        )}
                    </div>

                    <button type="submit">Se connecter</button>
                </form>
            </div>
        </section>
    );
};
