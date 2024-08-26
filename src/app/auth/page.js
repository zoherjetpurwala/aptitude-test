'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardBody } from '@nextui-org/card';
import { Button, Input } from '@nextui-org/react';

export default function AuthPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = isRegister ? '/api/auth/register' : '/api/auth/login';
    const payload = isRegister ? { email, password, name } : { email, password };

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      const data = await res.json();
      if (!isRegister) {
        localStorage.setItem('token', data.token);
        router.push('/app');
      } else {
        setIsRegister(false); // Switch to login after successful registration
      }
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <Card className="w-full border-2 max-w-md p-4 shadow-lg">
        <CardBody>
        <h2 className="text-2xl font-bold text-center">{isRegister ? 'Register' : 'Login'}</h2>
        <form onSubmit={handleSubmit}>
          {isRegister && (
            <Input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 mb-4 "
            />
          )}
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 mb-4   "
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 mb-4  "
          />
          <Button
            type="submit"
            className="w-full p-2 font-bold text-white bg-blue-500 hover:bg-blue-600"
          >
            {isRegister ? 'Register' : 'Login'}
          </Button>
        </form>
        <p className="text-center">
          {isRegister ? (
            <>
              Already have an account?{' '}
              <span
                className="text-blue-500 cursor-pointer"
                onClick={() => setIsRegister(false)}
              >
                Login
              </span>
            </>
          ) : (
            <>
              Don't have an account?{' '}
              <span
                className="text-blue-500 cursor-pointer"
                onClick={() => setIsRegister(true)}
              >
                Register
              </span>
            </>
          )}
        </p>
        </CardBody>
      </Card>
    </div>
  );
}
