import { useState } from "react";
import { Helmet } from "react-helmet-async";
import Input from "~/components/Input";
import Label from "~/components/Label";
import EnhanceSelect from "~/components/EnhanceSelect";
import TextFieldKey from "~/assets/images/textfield_key.png";
import { Trans, useTranslation } from "react-i18next";
import { getCurrentLocale, setCurrentLocale } from "~/helpers/locale";

import IconApply from "~/assets/images/apply-img.png";

import Button from "~/components/Button";
import { LOCALES } from "~/constants/locale";

const MyAccount = () => {
  const { t, i18n } = useTranslation("myAccount");

  const [me, _setMe] = useState({
    id: 1,
    first_name: "Son (internship)",
    last_name: "Nguyen Hoang Huu",
    email: "son.nguyen16@ntq-solution.com.vn",
    current_login_at: "2022-08-10 14:03:33 UTC",
    last_login_at: "2022-08-10 14:03:33 UTC",
    projects_count: 1,
    created_on: "2024-07-08T07:16:38Z",
    last_updated_at: "",
  });

  const [emailNotification, _setEmailNotification] = useState([
    { label: "For any event on all my projects", value: "all" },
    { label: "For any event on the selected projects only...", value: "selected" },
    { label: "Only for things I watch or I'm involved in", value: "only_my_events" },
    { label: "Only for things I am assigned to", value: "only_assigned" },
    { label: "Only for things I am the owner of", value: "only_owner" },
    { label: "No events", value: "none" },
  ]);

  const [timeZoneOptions, _setTimeZoneOptions] = useState([
    { label: "(GMT-11:00) American Samoa", value: "American Samoa" },
    { label: "(GMT-11:00) International Date Line West", value: "International Date Line West" },
    { label: "(GMT-11:00) Midway Island", value: "Midway Island" },
  ]);

  const [displayComments, _setDisplayComments] = useState([
    { label: "In chronological order", value: "asc" },
    { label: "In reverse chronological order", value: "desc" },
  ]);

  const [isShowKeyApi, setIsShowKeyApi] = useState(false);

  const [languagesOptions, _setLanguagesOptions] = useState([
    { label: "English", value: "en" },
    { label: "Vietnam", value: "vi" },
  ]);

  const [language, setLanguage] = useState(getCurrentLocale());

  const [isSaveSuccess, _setIsSaveSuccess] = useState(false);

  const handleSubmit = () => {
    if (language === "en") {
      setCurrentLocale(LOCALES.EN);
      i18n.changeLanguage(LOCALES.EN);
    } else if (language === "vi") {
      setCurrentLocale(LOCALES.VI);
      i18n.changeLanguage(LOCALES.VI);
    }
  };

  return (
    <>
      <Helmet>
        <title>{`My account - NTQ Redmine`}</title>
        <meta name="description" content="Redmine" />
      </Helmet>

      <div className="pt-2.5 flex">
        <div className="bg-white w-3/4 min-h-[70vh] px-3 pt-2 border-neutral-300 border">
          {isSaveSuccess && (
            <div className="flex items-center text-sm p-1 text-[#0e856c] gap-1 bg-[#dfffdf] border-2 border-[#9fcf9f]">
              <img src={IconApply} alt="IconApply" className="size-4" />
              <span>{t("updated_successfully")}</span>
            </div>
          )}

          <div className="flex justify-between text-xl font-semibold pt-0.5 pr-3 text-mouse-gray">
            <span>{t("title")}</span>
            <span className="flex items-center gap-1">
              <img src={TextFieldKey} alt="IconTextFieldKey" />
              <a href="#!" className="link text-xs font-thin">
                {t("change_password")}
              </a>
            </span>
          </div>
          <div className="flex gap-4">
            <div className="w-1/2">
              <fieldset className="text-xs pl-2.5 border bg-light-gray pb-1">
                <legend className="text-mouse-gray">{t("information.title")}</legend>
                <div className="flex">
                  <Label htmlFor="first_name" isRequired={true} className="flex gap-1 items-center p-0" name={t("information.first_name")}></Label>
                  <Input id="first_name" className="ml-2" style={{ width: "calc(100% - 200px)" }} value={me.first_name} />
                </div>
                <div className="flex">
                  <Label htmlFor="last_name" isRequired={true} className="flex gap-1 items-center p-0" name={t("information.last_name")}></Label>
                  <Input id="last_name" className="ml-2" style={{ width: "calc(100% - 200px)" }} value={me.last_name} />
                </div>
                <div className="flex">
                  <Label htmlFor="email" isRequired={true} className="flex gap-1 items-center p-0" name={t("information.email")}></Label>
                  <Input id="email" className="ml-2" style={{ width: "calc(100% - 200px)" }} value={me.email} />
                </div>
                <div className="flex">
                  <Label htmlFor="subject" className="flex gap-1 items-center p-0" name={t("information.language")}></Label>
                  <EnhanceSelect
                    id="tracker"
                    className="text-[13.33px] font-normal text-[black] ml-2"
                    style={{ width: "calc(100% - 200px)" }}
                    arrayOption={languagesOptions}
                    defaultValue={language ? language : "en"}
                    onChange={(e) => {
                      setLanguage(e.target.value);
                    }}
                  />
                </div>
              </fieldset>
              <Button className="mt-2" onClick={handleSubmit}>
                {t("button_save")}
              </Button>
            </div>
            <div className="w-1/2 flex flex-col gap-4">
              <fieldset className="text-xs pl-2.5 py-2 border flex flex-col bg-light-gray">
                <legend className="text-mouse-gray">{t("email_notification.title")}</legend>
                <EnhanceSelect
                  id="tracker"
                  className="text-[13.33px] font-normal text-[black] w-9/10"
                  arrayOption={emailNotification}
                  defaultValue={"en"}
                />
                <div className="flex items-center pl-1">
                  <Input type="checkbox" />
                  <span className="text-xs">{t("email_notification.get_notified")}</span>
                </div>
              </fieldset>
              <fieldset className="text-xs pl-2.5 py-2 border bg-light-gray">
                <legend className="text-mouse-gray">{t("preferences.title")}</legend>

                <div className="flex items-center gap-1">
                  <Label htmlFor="email" className="flex gap-1 items-center p-0" name={t("preferences.hide_email")} />
                  <Input type="checkbox" />
                </div>

                <div className="flex items-center">
                  <Label htmlFor="email" className="flex gap-1 items-center p-0" name={t("preferences.time_zone")} />
                  <EnhanceSelect
                    id="tracker"
                    className="text-[13.33px] font-normal text-[black] ml-2"
                    arrayOption={timeZoneOptions}
                    defaultValue={"en"}
                    style={{ width: "calc(100% - 200px)" }}
                  />
                </div>

                <div className="flex items-center">
                  <Label htmlFor="email" className="flex gap-1 items-center p-0" name={t("preferences.display_comments")} />
                  <EnhanceSelect
                    id="tracker"
                    className="text-[13.33px] font-normal text-[black] ml-2"
                    arrayOption={displayComments}
                    defaultValue={"en"}
                    style={{ width: "calc(100% - 200px)" }}
                  />
                </div>

                <div className="flex items-center gap-1">
                  <Label htmlFor="email" className="flex gap-1 items-center p-0 text-right" name={t("preferences.warn_when_leave")} />
                  <Input type="checkbox" />
                </div>
              </fieldset>
            </div>
          </div>
        </div>
        <div className="pl-2 flex flex-col text-mouse-gray">
          <div className="text-sm font-bold py-4">{t("side_bar.title")}</div>
          <span className="text-xs">
            {t("side_bar.login")}
            <a href="#!" className="link font-bold">
              {me.email}
            </a>
          </span>
          <span className="text-xs">{t("side_bar.created")} 07/04/2024 06:09 PM</span>
          <div className="text-[13px] font-bold py-4">{t("side_bar.access_key_atom")}</div>
          <span className="text-xs">
            <Trans
              defaults={t("side_bar.api_key_desc")}
              components={{
                Link1: <a href="#!" className="link" />,
              }}
            />
          </span>
          <div className="text-[13px] font-bold py-4">{t("side_bar.access_key_api")}</div>
          <a href="#!" className="link pb-3" onClick={() => setIsShowKeyApi((preState) => !preState)}>
            {t("side_bar.button_show")}
          </a>
          {isShowKeyApi && <span className="min-w-72 overflow-auto text-xs pb-2">2712378945b835ecee123456cbb3edc7929893d1</span>}
          <span className="text-xs">
            <Trans
              defaults={t("side_bar.atom_key_desc")}
              components={{
                Link1: <a href="#!" className="link" />,
              }}
            />
          </span>
        </div>
      </div>
    </>
  );
};

export default MyAccount;
