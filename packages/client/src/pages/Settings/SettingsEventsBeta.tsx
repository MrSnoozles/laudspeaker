import { useEffect, useState } from "react";
import { ExclamationCircleIcon } from "@heroicons/react/20/solid";
import { RadioGroup } from "@headlessui/react";
import ApiService from "services/api.service";
import { Input } from "components/Elements";
import Header from "components/Header";
import { useNavigate } from "react-router-dom";
import { startPosthogImport } from "reducers/settings";

const tabs = [
  { name: "Account", href: "/settings", current: false },
  { name: "API", href: "/settings/api", current: false },
  { name: "Email", href: "/settings/email", current: false },
  { name: "SMS", href: "/settings/sms", current: false },
  { name: "Slack", href: "/settings/slack", current: false },
  { name: "Events", href: "#", current: true },
  { name: "Plan", href: "/settings/plan", current: false },
  { name: "Billing", href: "/settings/billing", current: false },
  { name: "Team Members", href: "/settings/team", current: false },
];

const memoryOptions = [
  { name: "Posthog", inStock: true },
  { name: "Segment", inStock: false },
  { name: "Rudderstack", inStock: false },
  { name: "Mixpanel", inStock: false },
  { name: "Amplitude", inStock: false },
  { name: "GA", inStock: false },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function SettingsEventsBeta() {
  const [mem, setMem] = useState(memoryOptions[0]);
  const navigate = useNavigate();

  const [formData, setFormData] = useState<Record<string, string>>({
    posthogApiKey: "",
    posthogProjectId: "",
    posthogHostUrl: "",
    posthogSmsKey: "",
    posthogEmailKey: "",
  });

  useEffect(() => {
    (async () => {
      const { data } = await ApiService.get({ url: "/accounts" });
      const {
        posthogApiKey,
        posthogProjectId,
        posthogHostUrl,
        posthogSmsKey,
        posthogEmailKey,
      } = data;
      setFormData({
        posthogApiKey: posthogApiKey?.[0] || "",
        posthogProjectId: posthogProjectId?.[0] || "",
        posthogHostUrl: posthogHostUrl?.[0] || "",
        posthogSmsKey: posthogSmsKey?.[0] || "",
        posthogEmailKey: posthogEmailKey?.[0] || "",
      });
    })();
  }, []);

  const handleFormDataChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSync = async () => {
    await startPosthogImport();
  };

  const handleSubmit = async () => {
    const options: Record<string, any[]> = {};
    for (const key of Object.keys(formData)) {
      options[key] = [formData[key]];
    }
    await ApiService.patch({
      url: "/accounts",
      options,
    });
  };
  return (
    <>
      <div>
        {/* Content area */}
        <div className="">
          <div className="mx-auto flex flex-col">
            <Header />

            <main className="flex-1">
              <div className="relative mx-auto max-w-4xl md:px-8 xl:px-0">
                <div className="pt-10 pb-16">
                  <div className="px-4 sm:px-6 md:px-0">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                      Settings
                    </h1>
                  </div>
                  <div className="px-4 sm:px-6 md:px-0">
                    <div className="py-6">
                      {/* Tabs */}
                      <div className="lg:hidden">
                        <label htmlFor="selected-tab" className="sr-only">
                          Select a tab
                        </label>
                        <select
                          id="selected-tab"
                          name="selected-tab"
                          className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-cyan-500 focus:outline-none focus:ring-cyan-500 sm:text-sm"
                          defaultValue={tabs.find((tab) => tab.current)?.name}
                          onChange={(ev) => navigate(ev.currentTarget.value)}
                        >
                          {tabs.map((tab) => (
                            <option key={tab.name} value={tab.href}>
                              {tab.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="hidden lg:block">
                        <div className="border-b border-gray-200">
                          <nav className="-mb-px flex space-x-8">
                            {tabs.map((tab) => (
                              <a
                                key={tab.name}
                                href={tab.href}
                                className={classNames(
                                  tab.current
                                    ? "border-cyan-500 text-cyan-600"
                                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700",
                                  "whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
                                )}
                              >
                                {tab.name}
                              </a>
                            ))}
                          </nav>
                        </div>
                      </div>

                      {/* Description list with inline editing */}
                      <div className="mt-10">
                        <div className="space-y-1">
                          <h3 className="text-lg font-medium leading-6 text-gray-900">
                            Select Your Events Provider
                          </h3>
                          <p className="max-w-2xl text-sm text-gray-500">
                            For instructions on where to find these values,
                            please see our documentation.
                          </p>
                        </div>
                        <div className="space-y-10">
                          <div className="flex items-center justify-between"></div>

                          <RadioGroup
                            value={mem}
                            onChange={setMem}
                            className="mt-2"
                          >
                            <RadioGroup.Label className="sr-only">
                              {" "}
                              Choose a memory option{" "}
                            </RadioGroup.Label>
                            <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
                              {memoryOptions.map((option) => (
                                <RadioGroup.Option
                                  key={option.name}
                                  value={option}
                                  className={({ active, checked }) =>
                                    classNames(
                                      option.inStock
                                        ? "cursor-pointer focus:outline-none"
                                        : "opacity-25 cursor-not-allowed",
                                      active
                                        ? "ring-2 ring-offset-2 ring-cyan-500"
                                        : "",
                                      checked
                                        ? "bg-cyan-600 border-transparent text-white hover:bg-cyan-700"
                                        : "bg-white border-gray-200 text-gray-900 hover:bg-gray-50",
                                      "border rounded-md py-3 px-3 flex items-center justify-center text-sm font-medium sm:flex-1"
                                    )
                                  }
                                  disabled={!option.inStock}
                                >
                                  <RadioGroup.Label as="span">
                                    {option.name}
                                  </RadioGroup.Label>
                                </RadioGroup.Option>
                              ))}
                            </div>
                          </RadioGroup>
                        </div>
                        <div className="mt-6">
                          <dl className="divide-y divide-gray-200">
                            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                              <dt className="text-sm font-medium text-gray-500">
                                Posthog API Key
                              </dt>
                              <dd>
                                <div className="relative rounded-md ">
                                  <Input
                                    type="password"
                                    value={formData.posthogApiKey}
                                    onChange={handleFormDataChange}
                                    name="posthogApiKey"
                                    id="posthogApiKey"
                                    className={classNames(
                                      false
                                        ? "rounded-md sm:text-sm focus:!border-red-500 !border-red-300 shadow-sm focus:!ring-red-500 "
                                        : "rounded-md sm:text-sm focus:border-cyan-500 border-gray-300 shadow-sm focus:ring-cyan-500 "
                                    )}
                                    aria-invalid="true"
                                    aria-describedby="password-error"
                                  />
                                  {false && (
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center">
                                      <ExclamationCircleIcon
                                        className="h-5 w-5 text-red-500"
                                        aria-hidden="true"
                                      />
                                    </div>
                                  )}
                                </div>
                                {false && (
                                  <p
                                    className="mt-2 text-sm text-red-600"
                                    id="email-error"
                                  >
                                    Please enter a valid API key.
                                  </p>
                                )}
                              </dd>
                            </div>
                            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                              <dt className="text-sm font-medium text-gray-500">
                                Posthog Project ID
                              </dt>
                              <dd>
                                <Input
                                  type="text"
                                  value={formData.posthogProjectId}
                                  onChange={handleFormDataChange}
                                  name="posthogProjectId"
                                  id="posthogProjectId"
                                  className="rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 sm:text-sm"
                                  placeholder="1"
                                />
                              </dd>
                            </div>
                            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                              <dt className="text-sm font-medium text-gray-500">
                                Posthog URL
                              </dt>
                              <div className="mt-1 flex rounded-md shadow-sm">
                                <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-gray-500 sm:text-sm">
                                  https://
                                </span>
                                <Input
                                  type="text"
                                  value={
                                    formData.posthogHostUrl || "app.posthog.com"
                                  }
                                  onChange={handleFormDataChange}
                                  name="posthogHostUrl"
                                  id="posthogHostUrl"
                                  className="min-w-0 flex-1 rounded-none rounded-r-md border-gray-300 px-3 py-2 focus:border-cyan-500 focus:ring-cyan-500 sm:text-sm"
                                />
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={handleSync}
                              className="inline-flex items-center rounded-md border border-transparent bg-cyan-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-cyan-500 focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-md bg-white font-medium focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2"
                            >
                              Sync
                            </button>
                            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                              <dt className="text-sm font-medium text-gray-500">
                                Name of SMS/Phone number field on your Posthog
                                person
                              </dt>
                              <dd>
                                <Input
                                  type="text"
                                  value={formData.posthogSmsKey}
                                  onChange={handleFormDataChange}
                                  name="posthogSmsKey"
                                  id="posthogSmsKey"
                                  className="rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 sm:text-sm"
                                  placeholder="$phoneNumber"
                                />
                              </dd>
                            </div>
                            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                              <dt className="text-sm font-medium text-gray-500">
                                Name of Email address field on your Posthog
                                person
                              </dt>
                              <dd>
                                <Input
                                  type="text"
                                  value={formData.posthogEmailKey}
                                  onChange={handleFormDataChange}
                                  name="posthogEmailKey"
                                  id="posthogEmailKey"
                                  className="rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 sm:text-sm"
                                  placeholder="$email"
                                />
                              </dd>
                            </div>
                            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-10 sm:py-5 sm:pt-5">
                              <span className="flex-grow">
                                <button
                                  type="button"
                                  className="inline-flex items-center rounded-md border border-transparent bg-cyan-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-cyan-500 focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-md bg-white font-medium focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2"
                                  onClick={handleSubmit}
                                >
                                  Save
                                </button>
                              </span>
                            </div>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    </>
  );
}
