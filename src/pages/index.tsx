import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import { RiDeleteBin5Line } from "react-icons/ri";
import Link from "next/link";
import MultiSelect from "~/components/MultiSelect";
import { useState } from "react";

import { api } from "~/utils/api";

function WebsiteSection() {
  const [url, setURL] = useState("");
  const [websites, setWebsites] = useState<
    { url: string; name: string; favicon: string }[]
  >([]);

  return (
    <div>
      <form
        noValidate
        className=""
        onSubmit={(e) => {
          e.preventDefault();
          console.log(url);

          if (
            url &&
            !websites.find(
              (website) => website.url === url || website.name === url,
            )
          ) {
            // basename is the domain name
            const urlWithDefaultScheme = url.match(
              /^(https?|ftp):\/\/|^ftps?:\/\/|^www\./i,
            )
              ? url
              : `https://${url}`;

            try {
              const urlObject = new URL(urlWithDefaultScheme);
              const name = urlObject.hostname;
              console.log("adding website", name);
              console.log(urlObject);
              setWebsites([
                ...websites,
                {
                  url: urlWithDefaultScheme,
                  name,
                  favicon: `https://www.google.com/s2/favicons?domain=${urlObject.hostname}`,
                },
              ]);
            } catch (error) {
              console.error("Error parsing URL:", error);
            }
          }
          setURL("");
        }}
      >
        <input
          className="form-control"
          type="text"
          placeholder="Example: instagram.com"
          value={url}
          required
          onChange={(e) => setURL(e.currentTarget.value)}
        />
        <button className="btn btn-primary px-5" type="submit">
          Add
        </button>
      </form>
      {/* table head */}
      <ul className="max-w-xl">
        <header>Website</header>
        {websites?.map((website) => (
          <li
            key={website.name}
            className="flex items-center justify-between gap-1"
          >
            <div className="flex items-center gap-2">
              {website.favicon && (
                <img src={website.favicon} alt={website.name} />
              )}
              <span className="text-lg">{website.name}</span>
            </div>
            <button
              className="btn btn-primary px-5"
              onClick={() => {
                setWebsites(
                  websites.filter((website) => website.url !== website.url),
                );
              }}
            >
              {/* light gray stroke */}
              <RiDeleteBin5Line className="fill-current text-gray-600" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Home() {
  const hello = api.example.hello.useQuery({ text: "from tRPC" });
  // const test_websites
  return (
    <>
      <Head>
        <title>Dopminder| regain control of your attention</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="grid min-h-screen grid-cols-[160px_1fr] ">
        <Sidebar />
        <main className="overflow-auto p-5">
          <h4 className="">Sites</h4>
          <h5 className="mb-3">Distracting Sites</h5>
          {/* <MultiSelect options={[] as Option[]} /> */}
          <WebsiteSection />
        </main>
      </div>
    </>
  );
}
function Sidebar() {
  const feedbackLinks = [
    {
      // replace with environment variable
      href: `https://chrome.google.com/webstore/detail/${process.env.NAME}/${process.env.EXTENSION_ID}/reviews`,
      text: "Add a review",
    },
    {
      href: "https://github.com/Arthur-CWW/dopaminder/issues",
      text: "Report a bug",
    },
    {
      href: process.env.FEEDBACK_FORM,
      text: "Send feedback",
    },
  ];
  return (
    <aside className="flex h-screen w-full flex-col justify-between bg-light p-5">
      <nav className=" flex flex-col text-start">
        <div className="flex items-center gap-2 pb-2 text-start text-lg font-semibold">
          <img src="/dopamine.jpg" alt="logo" width="" className="w-10" />
          <h5 className="">Intention</h5>
        </div>
        <Link className=" active" href="/">
          Sites
        </Link>
        {/* <span className="after:w-2 after:content-[⏰]">
          TODO Fix pseudo elements
          </span> */}
        <Link className="after:w-2 after:content-[⏰]" href="/schedule">
          Schedule
        </Link>
        <Link className="" href="/goals">
          🎯 Goals
        </Link>
        <Link className="" href="/stats">
          📊 Stats
        </Link>
        <Link className="" href="/privacy">
          🔒 Privacy
        </Link>
      </nav>
      <ul className="align-left text-sm">
        {feedbackLinks.map((link) => (
          <li key={link.href}>
            <a
              href={link.href}
              className="btn btn-block btn-primary"
              target="_blank"
              rel="noopener noreferrer"
            >
              {link.text}
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
}

function AuthShowcase() {
  const { data: sessionData } = useSession();

  const { data: secretMessage } = api.example.getSecretMessage.useQuery(
    undefined, // no input
    { enabled: sessionData?.user !== undefined },
  );

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-center text-2xl text-white">
        {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
        {secretMessage && <span> - {secretMessage}</span>}
      </p>
      <button
        className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
        onClick={sessionData ? () => void signOut() : () => void signIn()}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </button>
    </div>
  );
}
