// import React, { useState } from 'react';
// import { Eye, EyeOff } from 'lucide-react';
// import { Input, Button } from '@/components/ui';

// const LoginPage = ({ onLogin, apiBaseUrl, showToast }) => {
//   const [formType, setFormType] = useState('login');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [role, setRole] = useState('intern');
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [errors, setErrors] = useState({});

//   const notify = (message, type) => (showToast ? showToast(message, type) : alert(message));

//   const switchForm = (type) => {
//     setFormType(type);
//     setErrors({});
//   };

//   const validate = () => {
//     const nextErrors = {};
//     if (!email) nextErrors.email = 'Email is required';
//     if (formType !== 'forgot' && !password) nextErrors.password = 'Password is required';
//     if (formType === 'register' && password && confirmPassword && password !== confirmPassword) {
//       nextErrors.confirmPassword = "Passwords don't match";
//     }
//     setErrors(nextErrors);
//     return Object.keys(nextErrors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!validate()) return;

//     setLoading(true);
//     try {
//       const endpoint =
//         formType === 'login' ? 'login' : formType === 'register' ? 'register' : 'forgot';

//       const res = await fetch(`${apiBaseUrl}/api/auth/${endpoint}`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(
//           formType === 'forgot'
//             ? { email }
//             : { name: email.split('@')[0], email, password, role }
//         ),
//       });

//       const data = await res.json();
//       setLoading(false);

//       if (!res.ok) {
//         notify(data.message || 'Something went wrong', 'error');
//         return;
//       }

//       if (formType === 'login') {
//         localStorage.setItem('token', data.token);
//         localStorage.setItem('user', JSON.stringify(data.user));
//         onLogin(data.user);
//       } else if (formType === 'register') {
//         notify('Registration successful. Please log in.', 'success');
//         switchForm('login');
//       } else {
//         notify('Password reset link sent.', 'success');
//         switchForm('login');
//       }
//     } catch (err) {
//       setLoading(false);
//       notify('An error occurred. Please try again.', 'error');
//     }
//   };

//   const heading = { login: 'Sign in', register: 'Create your account', forgot: 'Reset your password' }[formType];
//   const subheading = {
//     login: 'Welcome back — enter your details to continue.',
//     register: 'Fill in your details to get started.',
//     forgot: "We'll email you a link to reset your password.",
//   }[formType];

//   return (
//     <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 dark:bg-slate-950">
//       <div className="w-full max-w-md">
//         <div className="mb-8 flex flex-col items-center text-center">
//           <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-lg font-bold text-white">
//             OP
//           </div>
//           <h1 className="text-xl font-bold text-slate-900 dark:text-white">Onboarding Portal</h1>
//         </div>

//         <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
//           <h2 className="text-xl font-semibold text-slate-900 dark:text-white">{heading}</h2>
//           <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{subheading}</p>

//           <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
//             <Input
//               label="Email"
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               error={errors.email}
//               placeholder="you@company.com"
//               autoComplete="email"
//               required
//             />

//             {formType !== 'forgot' && (
//               <div>
//                 <label htmlFor="login-password" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
//                   Password<span className="ml-0.5 text-red-500">*</span>
//                 </label>
//                 <div className="relative">
//                   <input
//                     id="login-password"
//                     type={showPassword ? 'text' : 'password'}
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     autoComplete={formType === 'login' ? 'current-password' : 'new-password'}
//                     aria-invalid={!!errors.password}
//                     className={`w-full rounded-lg border px-3 py-2 pr-10 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-white dark:bg-slate-800 dark:text-white dark:focus:ring-offset-slate-900 ${
//                       errors.password ? 'border-red-400 focus:ring-red-500' : 'border-slate-300 focus:ring-blue-500 dark:border-slate-700'
//                     }`}
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowPassword((v) => !v)}
//                     aria-label={showPassword ? 'Hide password' : 'Show password'}
//                     className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
//                   >
//                     {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//                   </button>
//                 </div>
//                 {errors.password && (
//                   <p className="mt-1.5 text-xs font-medium text-red-600 dark:text-red-400">{errors.password}</p>
//                 )}
//               </div>
//             )}

//             {formType === 'register' && (
//               <Input
//                 label="Confirm password"
//                 type="password"
//                 value={confirmPassword}
//                 onChange={(e) => setConfirmPassword(e.target.value)}
//                 error={errors.confirmPassword}
//                 autoComplete="new-password"
//                 required
//               />
//             )}

//             {formType !== 'forgot' && (
//               <div>
//                 <span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Login as</span>
//                 <div className="grid grid-cols-2 gap-2">
//                   {['intern', 'employee', 'manager'].map((r) => (
//                     <button
//                       key={r}
//                       type="button"
//                       aria-pressed={role === r}
//                       onClick={() => setRole(r)}
//                       className={`rounded-lg border px-3 py-2 text-sm font-medium capitalize transition-colors ${
//                         role === r
//                           ? 'border-blue-600 bg-blue-50 text-blue-700 dark:border-blue-500 dark:bg-blue-500/10 dark:text-blue-300'
//                           : 'border-slate-300 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800'
//                       }`}
//                     >
//                       {r}
//                     </button>
//                   ))}
//                 </div>
//               </div>
//             )}

//             <Button type="submit" loading={loading} className="mt-2 w-full" size="lg">
//               {loading
//                 ? 'Please wait'
//                 : formType === 'login'
//                 ? 'Sign in'
//                 : formType === 'register'
//                 ? 'Create account'
//                 : 'Send reset link'}
//             </Button>
//           </form>

//           <div className="mt-6 space-y-2 text-center text-sm text-slate-500 dark:text-slate-400">
//             {formType === 'login' && (
//               <>
//                 <p>
//                   Don&rsquo;t have an account?{' '}
//                   <button onClick={() => switchForm('register')} className="font-medium text-blue-600 hover:underline dark:text-blue-400">
//                     Sign up
//                   </button>
//                 </p>
//                 <button onClick={() => switchForm('forgot')} className="font-medium text-blue-600 hover:underline dark:text-blue-400">
//                   Forgot password?
//                 </button>
//               </>
//             )}
//             {formType === 'register' && (
//               <p>
//                 Already have an account?{' '}
//                 <button onClick={() => switchForm('login')} className="font-medium text-blue-600 hover:underline dark:text-blue-400">
//                   Sign in
//                 </button>
//               </p>
//             )}
//             {formType === 'forgot' && (
//               <p>
//                 Remember your password?{' '}
//                 <button onClick={() => switchForm('login')} className="font-medium text-blue-600 hover:underline dark:text-blue-400">
//                   Sign in
//                 </button>
//               </p>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LoginPage;
import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Input, Button } from '@/components/ui';

const LoginPage = ({ onLogin, apiBaseUrl, showToast }) => {
  const [formType, setFormType] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('intern');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const notify = (message, type) => {
    if (showToast) {
      showToast(message, type);
    } else {
      alert(message);
    }
  };

  const switchForm = (type) => {
    setFormType(type);
    setErrors({});
    setPassword('');
    setConfirmPassword('');
  };

  const validate = () => {
    const nextErrors = {};

    if (!email.trim()) {
      nextErrors.email = 'Email is required';
    }

    if (formType !== 'forgot' && !password) {
      nextErrors.password = 'Password is required';
    }

    if (
      formType === 'register' &&
      password &&
      confirmPassword &&
      password !== confirmPassword
    ) {
      nextErrors.confirmPassword = "Passwords don't match";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!validate()) return;

  setLoading(true);

  try {
    const endpoint =
      formType === "login"
        ? "login"
        : formType === "register"
        ? "register"
        : "forgot";

    const body =
      formType === "forgot"
        ? {
            email: email.trim().toLowerCase(),
          }
        : {
            name: email.split("@")[0],
            email: email.trim().toLowerCase(),
            password,
            role,
          };

    console.log("AUTH REQUEST:", {
      url: `${apiBaseUrl}/api/auth/${endpoint}`,
      endpoint,
      body: {
        ...body,
        password: "***",
      },
    });

    const res = await fetch(
      `${apiBaseUrl}/api/auth/${endpoint}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    const data = await res.json();

    console.log("AUTH RESPONSE:", {
      status: res.status,
      ok: res.ok,
      data,
    });

    if (!res.ok) {
      notify(
        data.message || `Request failed with status ${res.status}`,
        "error"
      );
      return;
    }

    if (formType === "login") {
      if (!data.token) {
        notify(
          "Login succeeded but no token was returned.",
          "error"
        );
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      onLogin(data.user);

    } else if (formType === "register") {

      notify(
        "Registration successful. Please log in.",
        "success"
      );

      setPassword("");
      setConfirmPassword("");
      switchForm("login");

    } else {

      notify(
        "Password reset link sent.",
        "success"
      );

      switchForm("login");
    }

  } catch (err) {
    console.error("AUTH REQUEST ERROR:", err);

    notify(
      err.message || "Unable to connect to the server.",
      "error"
    );

  } finally {
    setLoading(false);
  }
};

const heading = {
    login: 'Sign in',
    register: 'Create your account',
    forgot: 'Reset your password',
  }[formType];

  const subheading = {
    login: 'Welcome back — enter your details to continue.',
    register: 'Fill in your details to get started.',
    forgot: "We'll email you a link to reset your password.",
  }[formType];

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 dark:bg-slate-950">
      <div className="w-full max-w-md">

        {/* Logo / Header */}
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-lg font-bold text-white">
            OP
          </div>

          <h1 className="text-xl font-bold text-slate-900 dark:text-white">
            Onboarding Portal
          </h1>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">

          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
            {heading}
          </h2>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {subheading}
          </p>

          <form
            onSubmit={handleSubmit}
            noValidate
            className="mt-6 space-y-4"
          >

            {/* Email */}
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              placeholder="you@company.com"
              autoComplete="email"
              required
            />

            {/* Password */}
            {formType !== 'forgot' && (
              <div>
                <label
                  htmlFor="login-password"
                  className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300"
                >
                  Password
                  <span className="ml-0.5 text-red-500">
                    *
                  </span>
                </label>

                <div className="relative">
                  <input
                    id="login-password"
                    type={
                      showPassword
                        ? 'text'
                        : 'password'
                    }
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                    autoComplete={
                      formType === 'login'
                        ? 'current-password'
                        : 'new-password'
                    }
                    aria-invalid={!!errors.password}
                    className={`w-full rounded-lg border px-3 py-2 pr-10 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-white dark:bg-slate-800 dark:text-white dark:focus:ring-offset-slate-900 ${
                      errors.password
                        ? 'border-red-400 focus:ring-red-500'
                        : 'border-slate-300 focus:ring-blue-500 dark:border-slate-700'
                    }`}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword((value) => !value)
                    }
                    aria-label={
                      showPassword
                        ? 'Hide password'
                        : 'Show password'
                    }
                    className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>

                {errors.password && (
                  <p className="mt-1.5 text-xs font-medium text-red-600 dark:text-red-400">
                    {errors.password}
                  </p>
                )}
              </div>
            )}

            {/* Confirm password */}
            {formType === 'register' && (
              <Input
                label="Confirm password"
                type="password"
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(e.target.value)
                }
                error={errors.confirmPassword}
                autoComplete="new-password"
                required
              />
            )}

            {/* Role */}
            {formType !== 'forgot' && (
              <div>
                <span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Login as
                </span>

                <div className="grid grid-cols-3 gap-2">
                  {[
                    'intern',
                    'employee',
                    'manager',
                  ].map((r) => (
                    <button
                      key={r}
                      type="button"
                      aria-pressed={role === r}
                      onClick={() => setRole(r)}
                      className={`rounded-lg border px-3 py-2 text-sm font-medium capitalize transition-colors ${
                        role === r
                          ? 'border-blue-600 bg-blue-50 text-blue-700 dark:border-blue-500 dark:bg-blue-500/10 dark:text-blue-300'
                          : 'border-slate-300 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Submit */}
            <Button
              type="submit"
              loading={loading}
              className="mt-2 w-full"
              size="lg"
            >
              {loading
                ? 'Please wait'
                : formType === 'login'
                  ? 'Sign in'
                  : formType === 'register'
                    ? 'Create account'
                    : 'Send reset link'}
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-6 space-y-2 text-center text-sm text-slate-500 dark:text-slate-400">

            {formType === 'login' && (
              <>
                <p>
                  Don&rsquo;t have an account?{' '}
                  <button
                    type="button"
                    onClick={() =>
                      switchForm('register')
                    }
                    className="font-medium text-blue-600 hover:underline dark:text-blue-400"
                  >
                    Sign up
                  </button>
                </p>

                <button
                  type="button"
                  onClick={() =>
                    switchForm('forgot')
                  }
                  className="font-medium text-blue-600 hover:underline dark:text-blue-400"
                >
                  Forgot password?
                </button>
              </>
            )}

            {formType === 'register' && (
              <p>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() =>
                    switchForm('login')
                  }
                  className="font-medium text-blue-600 hover:underline dark:text-blue-400"
                >
                  Sign in
                </button>
              </p>
            )}

            {formType === 'forgot' && (
              <p>
                Remember your password?{' '}
                <button
                  type="button"
                  onClick={() =>
                    switchForm('login')
                  }
                  className="font-medium text-blue-600 hover:underline dark:text-blue-400"
                >
                  Sign in
                </button>
              </p>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;