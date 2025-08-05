import { Card, CardBody } from "@nextui-org/card";
import { Chip } from "@nextui-org/chip";
import { Divider } from "@nextui-org/divider";
import {
  IconBrandWhatsapp,
  IconHeadset,
  IconMail,
  IconPhone,
} from "@tabler/icons-react";
import { motion } from "framer-motion";
import Layout from "../../components/Layout";

// Contact methods
const contactMethods = [
  {
    icon: <IconPhone className="text-primary" size={24} />,
    title: "Phone Support",
    description: "24/7 Customer Service",
    action: "Call Now",
    link: "tel:+9395783957",
  },
  {
    icon: <IconBrandWhatsapp className="text-success" size={24} />,
    title: "WhatsApp",
    description: "Chat with Support",
    action: "Open WhatsApp",
    link: "https://wa.me/9395783957",
  },
  {
    icon: <IconMail className="text-warning" size={24} />,
    title: "Email",
    description: "helpdesk.relynrelax@gmail.com ",
    action: "Send Email",
    link: "mailto:helpdesk.relynrelax@gmail.com",
  },
];

export default function Support() {
  return (
    <Layout title="Support">
      <div className="flex flex-col gap-4 p-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3"
        >
          <IconHeadset size={24} className="text-primary" />
          <div>
            <h1 className="text-xl font-bold">Contact Support</h1>
            <p className="text-small text-default-500">How can we help you?</p>
          </div>
        </motion.div>

        <Divider />

        {/* Contact Methods */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-col gap-3"
        >
          {contactMethods.map((method, index) => (
            <Card
              key={index}
              isPressable
              onPress={() => (window.location.href = method.link)}
              className="border-none w-full"
            >
              <CardBody className="flex flex-row items-center gap-3 p-3">
                {method.icon}
                <div className="flex-grow">
                  <h3 className="font-semibold text-sm">{method.title}</h3>
                  <p className="text-tiny text-default-500">
                    {method.description}
                  </p>
                </div>
              </CardBody>
            </Card>
          ))}
        </motion.div>

        {/* Support Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex items-center justify-between p-3 bg-content2 rounded-lg mt-2"
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span className="text-tiny">Support Status:</span>
            <Chip color="success" variant="flat" size="sm">
              Online
            </Chip>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}
