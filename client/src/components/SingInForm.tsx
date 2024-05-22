import React, { FC, ChangeEvent, Dispatch, SetStateAction } from 'react';
import { observer } from "mobx-react-lite";
import '../scss/SingInForm.scss';
import emailImg from "../image/email.svg";
import passwordImg from "../image/password.svg";


    interface SignInFormProps {
        email: string;
        setEmail: Dispatch<SetStateAction<string>>;
        password: string;
        setPassword: Dispatch<SetStateAction<string>>;
        onLogin: () => Promise<void>;
        onRegister: () => Promise<void>;
    }

    const SignInForm: FC<SignInFormProps> = ({
        email,
        setEmail,
        password,
        setPassword,
        onLogin,
        onRegister,
    }) => {
    const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    };

    return (
        <form action="#" className="form-form-box form-box">
            <div className="form-box-input-box input-box">
                <label className="input-box__info" htmlFor="email">
                    Email
                </label>
                <label className="input-box__icon" htmlFor="email">
                    <img src={emailImg} alt="email" />
                </label>
                <input
                    type="email"
                    name="email"
                    id="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={handleEmailChange}
                />
            </div>
            <div className="form-box-input-box input-box">
                <label className="input-box__info" htmlFor="password">
                    Password
                </label>
                <label className="input-box__icon" htmlFor="password">
                    <img src={passwordImg} alt="password" />
                </label>
                <input
                    type="password"
                    name="password"
                    id="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={handlePasswordChange}
                />
            </div>
            <div className="form-box-btn-box btn-box">
                <button type="button" onClick={onLogin}>
                    Login
                </button>
                <button type="button" onClick={onRegister}>
                    Register
                </button>
            </div>
        </form>
    );
};

export default observer(SignInForm);
