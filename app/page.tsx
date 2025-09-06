import App from "@/components/App";
import { env } from "@/lib/env";
import { Metadata } from "next";

const appUrl = env.NEXT_PUBLIC_URL;

const frame = {
  version: "next",
  imageUrl: `${appUrl}/images/feed.png`,
  button: {
    title: "Launch App",
    action: {
      type: "launch_frame",
      name: "Mini-app Starter",
      url: appUrl,
      splashImageUrl: `${appUrl}/images/splash.png`,
      splashBackgroundColor: "#ffffff",
    },
  },
};

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Mattrix - Decentralized CRM",
    openGraph: {
      title: "Mattrix - Decentralized CRM",
      description: "Conference networking CRM powered by Web3",
    },
    other: {
      "fc:frame": JSON.stringify({
        ...frame,
        button: {
          ...frame.button,
          title: "Launch Mattrix",
          action: {
            ...frame.button.action,
            name: "Mattrix CRM",
          },
        },
      }),
    },
  };
}

export default function Home() {
  return <App />;
}
