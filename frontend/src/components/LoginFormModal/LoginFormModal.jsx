
import { useState } from 'react';
import * as sessionActions from '../../store/session';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import './LoginForm.css';

function LoginFormModal() {
    const dispatch = useDispatch();
    const [credential, setCredential] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});
    const { closeModal } = useModal();

    const logInAsDemoUser = () => {
        setCredential("WillyShakes3");
        setPassword("password2");
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors({});
        return dispatch(sessionActions.login({ credential, password }))
            .then(closeModal)
            .catch(async (res) => {
                const data = await res.json();
                if (data && data.errors) {
                    setErrors(data.errors);
                }
            });
    };

    return (
        <div id='login-form'>
            <h1 id='header'>Log In</h1>
            <form onSubmit={handleSubmit} id='lfm-form'>
                <label className='lfm-label'>
                    Username or Email
                    <input
                        type="text"
                        value={credential}
                        onChange={(e) => setCredential(e.target.value)}
                        required
                    />
                </label>
                <label className='lfm-label'>
                    Password
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </label>
                {errors.credential && (
                    <p>{errors.credential}</p>
                )}
                <button type="submit" disabled={credential.length < 4 || password.length < 6 ? true : false}>Log In</button>
                <button type='submit' onClick={logInAsDemoUser}>Log in as Demo User</button>
            </form>
        </div>
    );
}

export default LoginFormModal;
