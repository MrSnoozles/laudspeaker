import React, {
  ReactElement,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import tokenService from "./services/token.service";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Channel from "./pages/Settings/channel";
import FlowBuilder from "pages/FlowBuilder";
import EmailConfig from "pages/EmailConfig";
import EventProvider from "pages/Settings/EventProvider";
import EmailConfiguration from "pages/Settings/EmailConfiguration";
import PosthogConfiguration from "pages/Settings/PosthogConfiguration";
import PosthogConfigurationTwo from "pages/Settings/PosthogConfigurationTwo";
import AdditionalPosthog from "pages/Settings/AdditionalPosthog";
import AdditionalSettings from "pages/Settings/AdditionalSettings";
import Completion from "pages/Settings/completion";
import TriggerCreater from "components/TriggerCreater";
import EmailBuilder from "pages/EmailBuilder";
import { useTypedSelector } from "hooks/useTypeSelector";
import { ActionType, AuthState, getUserPermissions } from "reducers/auth";
import SlackBuilder from "pages/SlackBuilder";
import Cor from "pages/Cor";
import FlowTable from "pages/FlowTable/FlowTable";
import TemplateTable from "pages/TemplateTable/TemplateTable";
import PeopleTable from "pages/PeopleTable/PeopleTable";
import Journeys from "pages/Journeys";
import Profile from "pages/Profile";
import FlowViewer from "pages/FlowViewer";
import NetworkCofiguration from "pages/Settings/NetworkConfiguration";
import SlackConfiguration from "pages/Settings/SlackConfiguration";
import { useDispatch } from "react-redux";
import { setSettingData } from "reducers/settings";
import ApiService from "services/api.service";
import EventsProv from "pages/Settings/EventsProv";
import DrawerLayout from "components/DrawerLayout";
import Integrations from "pages/Settings/Integrations";

interface IProtected {
  children: ReactElement;
}

const Protected = ({ children }: IProtected) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
  useLayoutEffect(() => {
    const func = async () => {
      const loggedIn = await tokenService.verify();
      setIsLoggedIn(loggedIn);
    };
    func();
  }, []);

  const dispatch = useDispatch();
  if (isLoggedIn) {
    dispatch(getUserPermissions());
  }

  return isLoggedIn ? children : <Navigate to="/login" replace />;
};

interface IOnboarded {
  children: ReactElement;
}

const Onboarded = ({ children }: IOnboarded) => {
  const { userData } = useTypedSelector<AuthState>((state) => state.auth);
  const dispatch = useDispatch();
  const { settings } = useTypedSelector((state) => state.settings);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userData.onboarded) {
      const func = async () => {
        let data: any;
        try {
          data = (
            await ApiService.get({
              url: "/accounts",
              options: {},
            })
          ).data;
        } catch (e) {
          return;
        }

        dispatch({
          type: ActionType.UPDATE_USER_INFO,
          payload: {
            ...userData,
            onboarded: data.onboarded,
            expectedOnboarding: data.expectedOnboarding,
          },
        });
        dispatch(
          setSettingData({
            ...settings,
            channel: data.expectedOnboarding.filter(
              (str: string) => !data.currentOnboarding.includes(str)
            ),
          })
        );
        if (settings.channel?.length > 0) {
          navigate("/settings/network-configuration");
          return;
        }
        navigate("/settings/channel");
      };

      func();
    }
  }, []);

  return userData.onboarded ? children : <></>;
};

const RouteComponent: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/"
          element={
            <Protected>
              <Onboarded>
                <DrawerLayout>
                  <Dashboard />
                </DrawerLayout>
              </Onboarded>
            </Protected>
          }
        />
        <Route
          path="/flow"
          element={
            <Protected>
              <Onboarded>
                <DrawerLayout>
                  <FlowTable />
                </DrawerLayout>
              </Onboarded>
            </Protected>
          }
        />
        <Route
          path="/flow/:name"
          element={
            <Protected>
              <Onboarded>
                <DrawerLayout>
                  <FlowBuilder />
                </DrawerLayout>
              </Onboarded>
            </Protected>
          }
        />
        <Route
          path="/flow/:name/view"
          element={
            <Protected>
              <Onboarded>
                <DrawerLayout>
                  <FlowViewer />
                </DrawerLayout>
              </Onboarded>
            </Protected>
          }
        />
        <Route
          path="/people"
          element={
            <Protected>
              <Onboarded>
                <DrawerLayout>
                  <PeopleTable />
                </DrawerLayout>
              </Onboarded>
            </Protected>
          }
        />
        <Route
          path="/emailconfig"
          element={
            <Protected>
              <DrawerLayout>
                <EmailConfig />
              </DrawerLayout>
            </Protected>
          }
        />
        <Route
          path="/settings/phconfiguration"
          element={
            <Protected>
              <DrawerLayout>
                <PosthogConfiguration />
              </DrawerLayout>
            </Protected>
          }
        />
        <Route
          path="/settings/phconfiguration-two"
          element={
            <Protected>
              <DrawerLayout>
                <PosthogConfigurationTwo />
              </DrawerLayout>
            </Protected>
          }
        />
        <Route
          path="/settings/profile"
          element={
            <Protected>
              <DrawerLayout>
                <Profile />
              </DrawerLayout>
            </Protected>
          }
        />
        <Route
          path="/settings/channel"
          element={
            <Protected>
              <DrawerLayout>
                <Channel />
              </DrawerLayout>
            </Protected>
          }
        />
        <Route
          path="/settings/events"
          element={
            <Protected>
              <DrawerLayout>
                <EventsProv />
              </DrawerLayout>
            </Protected>
          }
        />
        <Route
          path="/settings/event-provider"
          element={
            <Protected>
              <DrawerLayout>
                <EventProvider />
              </DrawerLayout>
            </Protected>
          }
        />
        <Route
          path="/settings/email-configuration"
          element={
            <Protected>
              <DrawerLayout>
                <EmailConfiguration />
              </DrawerLayout>
            </Protected>
          }
        />
        <Route
          path="/settings/slack-configuration"
          element={
            <Protected>
              <DrawerLayout>
                <SlackConfiguration />
              </DrawerLayout>
            </Protected>
          }
        />
        <Route
          path="/settings/network-configuration"
          element={
            <Protected>
              <NetworkCofiguration />
            </Protected>
          }
        />
        <Route
          path="/settings/additional-settings"
          element={
            <Protected>
              <DrawerLayout>
                <AdditionalSettings />
              </DrawerLayout>
            </Protected>
          }
        />
        <Route
          path="/settings/additional-posthog"
          element={
            <Protected>
              <DrawerLayout>
                <AdditionalPosthog />
              </DrawerLayout>
            </Protected>
          }
        />
        <Route
          path="/settings/completion"
          element={
            <Protected>
              <DrawerLayout>
                <Completion />
              </DrawerLayout>
            </Protected>
          }
        />
        <Route
          path="/settings/integrations"
          element={
            <Protected>
              <Onboarded>
                <DrawerLayout>
                  <Integrations />
                </DrawerLayout>
              </Onboarded>
            </Protected>
          }
        />
        <Route
          path="/trigger"
          element={
            <Protected>
              <TriggerCreater triggerType="timeWindow" />
            </Protected>
          }
        />
        <Route
          path="/email-builder"
          element={
            <Protected>
              <Onboarded>
                <DrawerLayout>
                  <EmailBuilder />
                </DrawerLayout>
              </Onboarded>
            </Protected>
          }
        />
        <Route
          path="/slack-builder"
          element={
            <Protected>
              <Onboarded>
                <DrawerLayout>
                  <SlackBuilder />
                </DrawerLayout>
              </Onboarded>
            </Protected>
          }
        />
        <Route
          path="/templates/email/:name"
          element={
            <Protected>
              <Onboarded>
                <DrawerLayout>
                  <EmailBuilder />
                </DrawerLayout>
              </Onboarded>
            </Protected>
          }
        />
        <Route
          path="/templates/slack/:name"
          element={
            <Protected>
              <Onboarded>
                <DrawerLayout>
                  <SlackBuilder />
                </DrawerLayout>
              </Onboarded>
            </Protected>
          }
        />
        <Route
          path="/all-templates"
          element={
            <Protected>
              <Onboarded>
                <DrawerLayout>
                  <TemplateTable />
                </DrawerLayout>
              </Onboarded>
            </Protected>
          }
        />
        <Route
          path="/slack/cor/:id"
          element={
            <Protected>
              <Cor />
            </Protected>
          }
        />
        <Route
          path="/journeys"
          element={
            <Protected>
              <Onboarded>
                <Journeys />
              </Onboarded>
            </Protected>
          }
        />
        <Route
          path="*"
          element={
            <Protected>
              <Onboarded>
                <DrawerLayout>
                  <Dashboard />
                </DrawerLayout>
              </Onboarded>
            </Protected>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default RouteComponent;
