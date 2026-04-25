import { createContext, useContext, useEffect, useState } from "react";
import {
  CognitoUserPool,
  CognitoUser,
  AuthenticationDetails,
  CognitoUserAttribute,
} from "amazon-cognito-identity-js";
import { toast } from "react-hot-toast";
import api from "../lib/axios";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

const CLIENT_ID = "5gj3npeacpkv7a1fomc2ddgqbr";

const userPool = new CognitoUserPool({
  UserPoolId: "ap-south-1_HopcJLw7m",
  ClientId: CLIENT_ID,
});

export const AuthProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // ─── Axios interceptor: attach fresh access token to every request ───
  useEffect(() => {
    const interceptor = api.interceptors.request.use(
      (config) => {
        const cognitoUser = userPool.getCurrentUser();
        if (!cognitoUser) return config;

        return new Promise((resolve, reject) => {
          cognitoUser.getSession((err, session) => {
            if (err || !session?.isValid()) {
              resolve(config); // send without token, backend will 401
              return;
            }
            config.headers.Authorization = `Bearer ${session.getAccessToken().getJwtToken()}`;
            resolve(config);
          });
        });
      },
      (error) => Promise.reject(error)
    );

    return () => api.interceptors.request.eject(interceptor);
  }, []);

  // ─── Check for existing session on app load ─────────────────────────
  useEffect(() => {
    const cognitoUser = userPool.getCurrentUser();
    if (!cognitoUser) {
      setIsCheckingAuth(false);
      return;
    }

    cognitoUser.getSession((err, session) => {
      if (err || !session?.isValid()) {
        setIsCheckingAuth(false);
        return;
      }

      cognitoUser.getUserAttributes((err, attributes) => {
        let attrs = {};
        if (!err && attributes) {
          attributes.forEach((a) => (attrs[a.Name] = a.Value));
        } else {
          // Fallback for federated users if standard attribute fetch fails
          try {
            attrs = session.getIdToken().decodePayload();
          } catch (e) {
            console.error("Failed to decode token", e);
          }
        }

        setAuthUser({
          email: attrs.email,
          name: attrs.name || attrs.email?.split("@")[0],
          sub: attrs.sub,
        });
        setIsCheckingAuth(false);
      });
    });
  }, []);

  // ─── Signup ─────────────────────────────────────────────────────────
  const signup = ({ name, email, password }) => {
    const attributes = [
      new CognitoUserAttribute({ Name: "email", Value: email }),
      new CognitoUserAttribute({ Name: "name", Value: name }),
    ];

    return new Promise((resolve, reject) => {
      userPool.signUp(email, password, attributes, null, (err, result) => {
        if (err) {
          toast.error(err.message || "Signup failed");
          reject(err);
          return;
        }

        if (result.userConfirmed) {
          toast.success("Account created successfully!");
        } else {
          toast.success("Account created! Check your email for a verification code.");
        }
        resolve(result);
      });
    });
  };

  // ─── Confirm signup (email verification code) ──────────────────────
  const confirmSignup = ({ email, code }) => {
    const cognitoUser = new CognitoUser({ Username: email, Pool: userPool });

    return new Promise((resolve, reject) => {
      cognitoUser.confirmRegistration(code, true, (err, result) => {
        if (err) {
          toast.error(err.message || "Verification failed");
          reject(err);
          return;
        }
        toast.success("Email verified! You can now log in.");
        resolve(result);
      });
    });
  };

  // ─── Login ──────────────────────────────────────────────────────────
  const login = ({ email, password }) => {
    const cognitoUser = new CognitoUser({ Username: email, Pool: userPool });
    const authDetails = new AuthenticationDetails({ Username: email, Password: password });

    return new Promise((resolve, reject) => {
      cognitoUser.authenticateUser(authDetails, {
        onSuccess: (session) => {
          cognitoUser.getUserAttributes((err, attributes) => {
            const attrs = {};
            if (attributes) {
              attributes.forEach((a) => (attrs[a.Name] = a.Value));
            }

            setAuthUser({
              email: attrs.email || email,
              name: attrs.name || email.split("@")[0],
              sub: attrs.sub,
            });
            toast.success("Logged in successfully");
            resolve(session);
          });
        },
        onFailure: (err) => {
          toast.error(err.message || "Invalid credentials");
          reject(err);
        },
      });
    });
  };


  // ─── Logout ─────────────────────────────────────────────────────────
  const logout = () => {
    const cognitoUser = userPool.getCurrentUser();
    if (cognitoUser) cognitoUser.signOut();
    setAuthUser(null);
    toast.success("Logged out successfully");
  };

  return (
    <AuthContext.Provider
      value={{ authUser, isCheckingAuth, signup, confirmSignup, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
