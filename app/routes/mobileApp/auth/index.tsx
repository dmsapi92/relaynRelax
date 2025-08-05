import { FirebaseAuthentication } from "@capacitor-firebase/authentication";
import { Button } from "@nextui-org/button";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { Navigate, useLoaderData, useSubmit } from "@remix-run/react";
import { IconBrandGoogle } from "@tabler/icons-react";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { motion } from "framer-motion";
import { ObjectId } from "mongodb";
import { useState } from "react";
import { getUserPrismaClient } from "~/lib/get-user-db.server";
import { authFirebase } from "~/utils/firebase.client";
import {
  createcustomerSession,
  getUserIdMobile,
  getUserTypeMobile,
} from "~/utils/session.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const institutionId = url.searchParams.get("systemId");
  const userId = await getUserIdMobile(request);
  const userType = await getUserTypeMobile(request);
  const { prisma } = await getUserPrismaClient(
    institutionId?.toString() ?? request,
    true
  );

  let user;
  if (userId) {
    user = await prisma.user.findUnique({
      where: { id: userId },
    });
  }

  const system = await prisma.system.findFirst({});
  if (!system) {
    throw new Error("Institution not found");
  }

  return json({
    isAuthenticated: false,
    system,
    user,
    userType,
  });
}
export async function action({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const systemId = url.searchParams.get("systemId");
  const { prisma } = await getUserPrismaClient(
    systemId?.toString() ?? request,
    true
  );
  const formData = await request.formData();
  const { email, name, photoURL, campusId } = Object.fromEntries(formData);

  const existingUser = await prisma.user.findFirst({
    where: { email: email as string },
  });

  if (existingUser) {
    return await createcustomerSession(
      systemId!,
      existingUser.id,
      "/mobileApp/customer"
    );
  }

  const firstName = (name as string).split(" ")[0];
  const lastName = (name as string).split(" ").slice(1).join(" ") || firstName;
  const newUserId = new ObjectId();

  await prisma.user.create({
    data: {
      id: newUserId.toString(),
      email: email as string,
      firstName,
      lastName,
      password: "",
      isVerified: true,
    },
  });

  return await createcustomerSession(
    systemId!,
    newUserId.toString(),
    "/mobileApp/customer"
  );
}

export default function MobileApp() {
  const { system, user, userType } = useLoaderData<typeof loader>();
  const [isLoading, setIsLoading] = useState(false);
  const submit = useSubmit();

  if (user) {
    return <Navigate to={`/mobileApp/${userType?.toLowerCase()}`} />;
  }

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      const result = await FirebaseAuthentication.signInWithGoogle();

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
    } catch (error) {
      console.error("Error signing in with Google:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] flex items-center justify-center p-4 bg-gradient-to-b from-primary/10 to-background">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-[380px]"
      >
        <Card className="shadow-2xl backdrop-blur-lg bg-background/80 px-2">
          <CardHeader className="flex flex-col items-center gap-6 pt-8 sm:pt-10">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5, type: "spring" }}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center shadow-xl ring-2 ring-primary/20"
            >
              {system.logo ? (
                <img
                  src={system.logo}
                  alt="relyNrelax"
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <img
                  src="/images/logo.png"
                  alt="Logo"
                  className="w-16 h-16 sm:w-20 sm:h-20 object-contain"
                />
              )}
            </motion.div>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-center space-y-2"
            >
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                relyNrelax
              </h1>
              <p className="text-default-500 text-sm sm:text-base">
                Welcome to your digital home
              </p>
            </motion.div>
          </CardHeader>

          <CardBody className="flex flex-col gap-6 items-center pb-8 px-4 sm:px-8">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="w-full"
            >
              <Button
                startContent={<IconBrandGoogle className="w-5 h-5" />}
                color="primary"
                size="lg"
                variant="shadow"
                className="w-full font-semibold shadow-lg hover:shadow-primary/25 transition-all duration-300 text-sm sm:text-base"
                onPress={handleGoogleSignIn}
                isLoading={isLoading}
              >
                {isLoading ? "Signing in..." : "Continue with Google"}
              </Button>
            </motion.div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="text-tiny text-default-400 text-center"
            >
              By continuing, you agree to our Terms of Service and Privacy
              Policy
            </motion.p>
          </CardBody>
        </Card>
      </motion.div>
    </div>
  );
}
