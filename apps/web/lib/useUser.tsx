import { useSession } from "next-auth/react";
import { useEffect, useState, createContext, useContext, FC } from "react";

import { Subscription, User } from "types";
import fetcher from "./fetcher";

type UserContextValue = {
  user: User | null;
  isLoading: boolean;
  subscription: Subscription | null;
};

export const UserContext = createContext<UserContextValue | undefined>(
  undefined
);

export const UserContextProvider: FC = (props) => {
  const { data: session } = useSession();
  const [user, setUser] = useState<User>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const getSubscription = async () => {
    const result = await fetcher(`/apis/main/users/${user.id}/subscriptions`);
    setSubscription(result[0] ?? null);
    setIsLoading(false);
  };

  useEffect(() => {
    if (!session) {
      setUser(null);
      setSubscription(null);
    } else if (user && !subscription) {
      setIsLoading(true);
      getSubscription();
    } else {
      const { user } = session;
      setUser(user as User);
    }
  }, [session, user]);

  const value = {
    user,
    isLoading,
    subscription,
  };

  return <UserContext.Provider value={value} {...props} />;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserContextProvider.");
  }
  return context;
};
