import { type RouteObject } from "react-router-dom";
import { Layout } from "@/layout";
import Home from "@/pages/Home";
import ToolLibrary from "@/pages/ToolLibrary";
import BusinessBrain from "@/pages/BusinessBrain";
import Insights from "@/pages/Insights";
import Assessment from "@/pages/Assessment";
import Enterprise from "@/pages/Enterprise";
import AgentCenter from "@/pages/AgentCenter";
import Vip from "@/pages/Vip";
import PaymentResult from "@/pages/PaymentResult";

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "tools", element: <ToolLibrary /> },
      { path: "business-brain", element: <BusinessBrain /> },
      { path: "insights", element: <Insights /> },
      { path: "assessment", element: <Assessment /> },
      { path: "enterprise", element: <Enterprise /> },
      { path: "agent", element: <AgentCenter /> },
      { path: "vip", element: <Vip /> },
      { path: "payment-result", element: <PaymentResult /> },
    ],
  },
];
