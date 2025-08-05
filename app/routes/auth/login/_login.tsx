import { FirebaseAuthentication } from "@capacitor-firebase/authentication";
import { Button, Card, CardBody, CardHeader } from "@nextui-org/react";
import {
  MetaFunction,
  useActionData,
  useSearchParams,
  useSubmit,
} from "@remix-run/react";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { motion } from "framer-motion";
import { Calendar, Car, LucideChrome, Shield } from "lucide-react";
import { useState } from "react";
import AuthLayout from "~/routes/auth/AuthLayout";
import { authFirebase } from "~/utils/firebase.client";
import { generateAuthPageSEO } from "~/utils/seo";
import { actionLoginApi } from "../api/login/loginapi";

// Action data type
type ActionData = {
  error?: string;
  status?: string;
  showPhoneModal?: boolean;
  customerId?: string;
};

export const meta: MetaFunction = () => {
  return generateAuthPageSEO("login");
};

export const action = actionLoginApi;

export default function Login() {
  const actionData = useActionData<typeof action>();
  const [searchParams] = useSearchParams();
  const verified = searchParams.get("verified");
  const [isLoading, setIsLoading] = useState(false);
  const submit = useSubmit();
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const iconVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: { type: "spring", stiffness: 260, damping: 20 },
    },
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      const result = await FirebaseAuthentication.signInWithGoogle();
      console.log(result);

      if (result.credential) {
        const credential = GoogleAuthProvider.credential(
          result.credential.idToken
        );
        const data = await signInWithCredential(authFirebase, credential);

        const formData = new FormData();
        formData.append("email", data.user.email || "");
        formData.append("name", data.user.displayName || "");
        formData.append("photoURL", data.user.photoURL || "");

        submit(formData, { method: "POST" });
      }
      // Google signin logic already implemented
    } catch (error) {
      console.error("Google sign in error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout isLogin={true}>
      <Card className="max-w-sm mx-auto p-6 shadow-lg border border-default">
        <CardBody
          as={motion.div}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          <CardHeader className="flex flex-col gap-4 items-center p-0">
            <motion.div
              className="rounded-full bg-primary-100 dark:bg-primary-900/30 p-4"
              variants={iconVariants}
            >
              <img
                src="/images/logo.png"
                alt="Logo"
                className="w-16 h-16 sm:w-20 sm:h-20 object-contain bg-white rounded-full p-1"
              />
            </motion.div>

            <motion.h3
              className="text-2xl font-bold text-center"
              variants={itemVariants}
            >
              Welcome to relyNrelax
            </motion.h3>

            <motion.p
              className="text-default-500 text-center"
              variants={itemVariants}
            >
              One-click sign in to access your document reminders
            </motion.p>
          </CardHeader>

          {verified && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <Card className="bg-success-50 border-success">
                <CardBody>
                  <p className="text-success text-sm text-center">
                    Email verified successfully! You can now log in.
                  </p>
                </CardBody>
              </Card>
            </motion.div>
          )}

          {actionData?.error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <Card className="bg-danger-50 border-danger">
                <CardBody>
                  <p className="text-danger text-sm text-center">
                    {actionData.error}
                  </p>
                </CardBody>
              </Card>
            </motion.div>
          )}

          <motion.div
            className="flex justify-center gap-4 py-2"
            variants={itemVariants}
          >
            {[
              { icon: Car, color: "text-primary" },
              { icon: Calendar, color: "text-secondary" },
              { icon: Shield, color: "text-success" },
            ].map((item, index) => (
              <motion.div
                key={index}
                className={`p-2 rounded-full ${
                  index === 0
                    ? "bg-primary/10"
                    : index === 1
                    ? "bg-secondary/10"
                    : "bg-success/10"
                }`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                whileHover={{ y: -5, transition: { duration: 0.3 } }}
              >
                <item.icon className={`h-5 w-5 ${item.color}`} />
              </motion.div>
            ))}
          </motion.div>

          <motion.div variants={itemVariants}>
            <Button
              onPress={handleGoogleSignIn}
              color="primary"
              variant="solid"
              fullWidth
              size="lg"
              isLoading={isLoading}
              startContent={!isLoading && <LucideChrome className="w-5 h-5" />}
              className="font-medium"
              as={motion.button}
              whileHover={{
                scale: 1.02,
                boxShadow: "0 5px 15px rgba(0, 0, 0, 0.1)",
              }}
              whileTap={{ scale: 0.98 }}
            >
              {isLoading ? "Signing in..." : "Sign in with Google"}
            </Button>
          </motion.div>

          <motion.div
            className="text-center text-xs text-default-500"
            variants={itemVariants}
            whileHover={{ color: "var(--primary)" }}
          >
            Securely login to manage your vehicle document reminders
          </motion.div>
        </CardBody>
      </Card>
    </AuthLayout>
  );
}
