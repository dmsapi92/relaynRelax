import { Card, CardBody } from "@nextui-org/card";
import { motion } from "framer-motion";

export default function Support() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl font-bold text-center">Need Support?</h1>
      </motion.div>

      <Card>
        <CardBody>
          <div className="text-center space-y-6">
            <p className="text-xl">We're here to help! Give us a call at:</p>

            <p className="text-3xl font-bold text-primary">(863) 816-1443</p>

            <p className="text-lg text-default-600">
              Our friendly support team is ready to assist you with any
              questions or concerns.
            </p>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
