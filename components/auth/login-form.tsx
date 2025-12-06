"use client";

import { useState } from "react";
import { Form, Input, Button, Card, Typography, Divider, App } from "antd";
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  GoogleOutlined,
} from "@ant-design/icons";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";

const { Title, Text } = Typography;

export default function LoginForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const { signIn, signUp, signInWithGoogle } = useAuth();
  const [form] = Form.useForm();
  const router = useRouter();
  const { message } = App.useApp();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      if (isLogin) {
        await signIn(values.email, values.password);
        message.success("Welcome back!");
        router.push("/");
      } else {
        await signUp(values.email, values.password, {
          name: values.name,
          phone: values.phone,
        });
        message.success(
          "Account created! Please check your email for verification."
        );
        setIsLogin(true);
        form.resetFields();
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
      message.success("Signed in with Google successfully!");
      router.push("/");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      message.error(error.message || "Failed to sign in with Google");
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-0 sm:px-6 lg:px-8">
      <Card className="max-w-md w-full space-y-8 shadow-lg">
        <div className="text-center">
          <Title level={2} className="text-purple-600">
            👗 StichFlow
          </Title>
          <Text className="text-gray-600">
            {isLogin ? "Sign in to your account" : "Create your account"}
          </Text>
        </div>

        <Button
          type="default"
          onClick={handleGoogleSignIn}
          loading={googleLoading}
          size="large"
          className="w-full mb-6"
          icon={<GoogleOutlined />}
        >
          Continue with Google
        </Button>

        <Divider>
          <Text type="secondary">or</Text>
        </Divider>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="space-y-4"
        >
          {!isLogin && (
            <>
              <Form.Item
                name="name"
                label="Full Name"
                rules={[{ required: true, message: "Please enter your name" }]}
              >
                <Input
                  prefix={<UserOutlined />}
                  placeholder="Enter your full name"
                  size="large"
                />
              </Form.Item>

              <Form.Item
                name="phone"
                label="Phone Number"
                rules={[
                  { required: true, message: "Please enter your phone number" },
                ]}
              >
                <Input
                  prefix={<UserOutlined />}
                  placeholder="Enter your phone number"
                  size="large"
                />
              </Form.Item>
            </>
          )}

          <Form.Item
            name="email"
            label="Email Address"
            rules={[
              { required: true, message: "Please enter your email" },
              { type: "email", message: "Please enter a valid email" },
            ]}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="Enter your email"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[
              { required: true, message: "Please enter your password" },
              { min: 6, message: "Password must be at least 6 characters" },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Enter your password"
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              size="large"
              className="w-full bg-purple-600 hover:bg-purple-700 border-purple-600"
            >
              {isLogin ? "Sign In" : "Create Account"}
            </Button>
          </Form.Item>
        </Form>

        <Divider>
          <Text type="secondary">or</Text>
        </Divider>

        <div className="text-center">
          <Button
            type="link"
            onClick={() => setIsLogin(!isLogin)}
            className="text-purple-600"
          >
            {isLogin
              ? "Don't have an account? Sign up"
              : "Already have an account? Sign in"}
          </Button>
        </div>
      </Card>
    </div>
  );
}
