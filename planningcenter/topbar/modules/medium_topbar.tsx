import * as React from "react";
import pcoUrl from "./pco_url";
import { StyledRoot } from "./styled_root";
import { Avatar } from "./avatar";
import { Unbutton } from "./unbutton";
import { fontFamily, IEFlex1, slightBackgroundTransition } from "./styles";
import { appsMenuFormatter, connectedPeopleMenuFormatter } from "./formatters";

// TODO: extract to component. imported from NotSmallTopbar
import {
  AppsButton,
  AppsMenu,
  HoverableListItem,
  PopupRoot,
  Popup,
  Outsider,
  Hoverable,
} from "./not_small_topbar";
import { NONAME } from "dns";

// TODO: Duped from small_topbar
const DisclosureChevronIcon = (props) => (
  <svg
    style={{
      marginLeft: "4px",
      verticalAlign: "middle",
    }}
    width="16"
    height="16"
    viewBox="0 0 16 16"
    {...props}
  >
    <title>chevron</title>
    <polygon
      fill="currentColor"
      points="11.931 4.892 8 8.824 4.069 4.892 2.927 6.034 8 11.108 9.142 9.966 13.073 6.034 11.931 4.892"
    />
  </svg>
);

// TODO: Duped from small_topbar
const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

// TODO: Duped from not_small_topbar
const HelpIcon = ({ colors }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    color={colors.base3}
    style={{ display: "block" }}
  >
    <title>help</title>
    <path
      d="M12,22A10,10,0,1,1,22,12,10.011,10.011,0,0,1,12,22ZM12,4a8,8,0,1,0,8,8A8.009,8.009,0,0,0,12,4Zm-.342,11.067a1.41,1.41,0,1,0,1.41,1.41A1.41,1.41,0,0,0,11.658,15.067Zm1.914-2.488c1.938-1.885,2.232-3.607.872-5.118A3.37,3.37,0,0,0,11.9,6.307h-.017A5.121,5.121,0,0,0,8.343,7.959L9.817,9.311a3.153,3.153,0,0,1,2.067-1h.008a1.366,1.366,0,0,1,1.065.493c.494.549.517,1.085-.78,2.345A4.612,4.612,0,0,0,10.632,14.2h2A2.733,2.733,0,0,1,13.572,12.579Z"
      fill="currentColor"
    />
  </svg>
);

export class Topbar extends React.Component<
  {
    apps: { attributes: { name: string; url: string } }[];
    // activeRoute: string;
    env: string;
    appName: string;
    routes: any;
    colors: any;
    userAvatarPath: string;
    userId: string;
    userName: string;
    orgName: string;
    connectedPeople: any;
    search?: any;
    style?: any;
    showOrgName?: boolean;
    notifications?: any;
    requestAppsFetch: any;
    requestConnectedPeopleFetch: any;
    requestUnlinkConnectedPeople: any;
    requestSwitchConnectedPerson: any;
    requestClearAppsCache: any;
    requestClearConnectedPeopleCache: any;
    linkToProfile?: boolean;
  },
  {
    appsMenuVisible: boolean;
    routesMenuVisible: boolean;
    userMenuVisible: boolean;
  }
> {
  constructor(props: any) {
    super(props);

    this.state = {
      appsMenuVisible: false,
      routesMenuVisible: false,
      userMenuVisible: false,
    };
  }

  public static defaultProps = {
    currentRouteComponent: (props) => <span {...props} />,
  };

  render() {
    const activeRoute =
      this.props.routes.filter(({ props }) => props.active) || [];

    const currentRouteText =
      (activeRoute &&
        activeRoute[0] &&
        activeRoute[0].props &&
        activeRoute[0].props.children) ||
      this.props.appName;

    // TODO: Duped from small_topbar
    const ProfileContainer = ({ component, href, ...nativeProps }) =>
      this.props.linkToProfile ? (
        <HoverableListItem component={component} href={href} {...nativeProps} />
      ) : (
        <div {...nativeProps} />
      );

    return (
      <StyledRoot
        style={{
          paddingLeft: 8,
          paddingRight: 8,
          ...this.props.style,
        }}
      >
        <AppsMenu
          env={this.props.env}
          apps={appsMenuFormatter(this.props.apps)}
          visible={this.state.appsMenuVisible}
          toggle={() =>
            this.setState(({ appsMenuVisible }) => ({
              appsMenuVisible: !appsMenuVisible,
            }))
          }
        />
        <AppsButton
          appName={this.props.appName.replace(/[\s-]/, "")}
          colors={this.props.colors}
          expanded={this.state.appsMenuVisible}
          displayIconOnly={true}
          onClick={() =>
            this.setState(
              ({ appsMenuVisible }) => ({
                appsMenuVisible: !appsMenuVisible,
              }),
              this.props.requestAppsFetch()
            )
          }
        />
        <div
          style={{
            margin: "auto",
            position: "relative",
          }}
        >
          {this.state.routesMenuVisible && (
            <PopupRoot>
              <Popup
                style={{
                  marginTop: "56px",
                  ...(this.state.routesMenuVisible
                    ? {
                        visibility: "visible",
                        opacity: 1,
                        transition: "none",
                      }
                    : {
                        visibility: "hidden",
                        opacity: 0,
                        transition: "all 120ms ease-in",
                      }),
                }}
                component={Outsider}
                onOutsideClick={() =>
                  this.setState(({ routesMenuVisible }) => ({
                    routesMenuVisible: !routesMenuVisible,
                  }))
                }
                cleanup={!this.state.routesMenuVisible}
              >
                {this.props.routes}
              </Popup>
            </PopupRoot>
          )}
          <Hoverable
            component="button"
            style={{
              cursor: "pointer",
              color: "white",
              fontWeight: 600,
              height: "48px",
              display: "flex",
              border: "none",
              appearance: "none",
              WebkitAppearance: "none",
              backgroundColor: this.props.colors.base0,

              outline: 0, // TODO: #improve-outline-a11y
              paddingRight: 8,
              paddingLeft: 16,
              alignItems: "center",
              justifyContent: "center",
              ...slightBackgroundTransition,
            }}
            active={{ backgroundColor: this.props.colors.base3 }}
            hover={{ backgroundColor: this.props.colors.base1 }}
            onClick={() =>
              this.setState(({ routesMenuVisible }) =>
                routesMenuVisible
                  ? {
                      routesMenuVisible: false,
                    }
                  : {
                      routesMenuVisible: true,
                    }
              )
            }
          >
            {capitalize(currentRouteText)}
            <DisclosureChevronIcon color={this.props.colors.base3} />
          </Hoverable>
        </div>
        <Unbutton style={{ marginRight: "8px" }} id="jsLaunchHelpdesk">
          <HelpIcon colors={this.props.colors} />
        </Unbutton>
        <div
          style={{
            position: "relative",
            whiteSpace: "nowrap",
            cursor: "pointer",
            display: "block",
          }}
        >
          <Hoverable
            component="button"
            type="button"
            style={{
              outline: 0, // TODO: #improve-outline-a11y
              cursor: "pointer",
              border: 0,
              padding: 0,
              appearance: "none",
              WebkitAppearance: "none",
              alignItems: "center",
              justifyContent: "center",
              height: "48px",
              width: "52px",
              backgroundColor: this.props.colors.base0,
              display: "flex",
              ...slightBackgroundTransition,
            }}
            active={{ backgroundColor: this.props.colors.base3 }}
            hover={{ backgroundColor: this.props.colors.base1 }}
            onClick={() =>
              this.setState(
                ({ userMenuVisible }) => ({
                  userMenuVisible: !userMenuVisible,
                }),
                this.props.requestConnectedPeopleFetch()
              )
            }
          >
            <Avatar
              env={this.props.env}
              url={this.props.userAvatarPath}
              style={{ margin: 0 }}
            />
          </Hoverable>
        </div>
        <PopupRoot>
          <Popup
            component={Outsider}
            onOutsideClick={() =>
              this.setState(({ userMenuVisible }) => ({
                userMenuVisible: !userMenuVisible,
              }))
            }
            cleanup={!this.state.userMenuVisible}
            style={{
              color: "#525252",
              right: 0,
              marginTop: "8px",
              maxWidth: "320px",
              ...(this.state.userMenuVisible
                ? {
                    visibility: "visible",
                    opacity: 1,
                    transition: "none",
                  }
                : {
                    visibility: "hidden",
                    opacity: 0,
                    transition: "all 120ms ease-in",
                  }),
              cursor: "default",
            }}
          >
            <div>
              <ProfileContainer
                component="a"
                href={`/people/AC${this.props.userId}`}
                data-turbolinks={false}
                style={{
                  display: "block",
                  padding: "16px",
                  textDecoration: "none",
                }}
              >
                <div
                  style={{
                    fontSize: "18px",
                    lineHeight: "24px",
                    display: "flex",
                  }}
                >
                  <div
                    style={{
                      ...IEFlex1,
                      ...fontFamily,
                      maxWidth: "240px",
                      marginRight: 8,
                      color: "#444",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {this.props.userName}
                    </div>
                  </div>

                  {this.props.linkToProfile && (
                    <small
                      style={{
                        fontSize: "12px",
                        color: "#666",
                        ...fontFamily,
                      }}
                    >
                      profile
                    </small>
                  )}
                </div>

                <div
                  style={{
                    fontSize: "14px",
                    lineHeight: "24px",
                    color: "#666",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    ...fontFamily,
                  }}
                >
                  {this.props.orgName}
                </div>
              </ProfileContainer>

              {this.props.connectedPeople.length ? (
                <div
                  style={{
                    display: "flex",
                    backgroundColor: "#eee",
                    alignItems: "center",
                    borderTop: "1px solid #ddd",
                    lineHeight: "32px",
                    padding: "0 16px",
                  }}
                >
                  <div
                    style={{
                      ...IEFlex1,
                      textTransform: "uppercase",
                      color: "#666",
                      fontSize: "12px",
                      whiteSpace: "nowrap",
                      ...fontFamily,
                    }}
                  >
                    Linked Accounts
                  </div>

                  <div
                    style={{
                      ...IEFlex1,
                      textAlign: "right",
                      alignItems: "center",
                      fontSize: "12px",
                    }}
                  >
                    <a
                      href=""
                      onClick={(e) => {
                        this.props.requestClearAppsCache();
                        this.props.requestClearConnectedPeopleCache();
                        this.props.requestUnlinkConnectedPeople();
                        e.preventDefault();
                      }}
                      style={{
                        color: "#666",
                        textDecoration: "none",
                        marginLeft: "64px",
                        ...fontFamily,
                      }}
                    >
                      unlink
                    </a>
                  </div>
                </div>
              ) : (
                <noscript />
              )}

              <style>{`
                .NotSmallTopbar__connected-people-list > *:first-child > * { border-top-width: 0 !important }
              `}</style>
              <ul
                className="NotSmallTopbar__connected-people-list"
                style={{ margin: 0, padding: 0, listStyleType: "none" }}
              >
                {connectedPeopleMenuFormatter(this.props.connectedPeople).map(
                  ({ id, attributes: person }) => (
                    <HoverableListItem component="li" key={id}>
                      <a
                        href=""
                        onClick={(e) => {
                          this.props.requestClearAppsCache();
                          this.props.requestClearConnectedPeopleCache();
                          this.props.requestSwitchConnectedPerson(
                            id,
                            `${this.props.appName}/`
                          );
                          e.preventDefault();
                        }}
                        style={{
                          marginLeft: "16px",
                          paddingRight: "16px",
                          lineHeight: "48px",
                          display: "block",
                          color: "#444",
                          whiteSpace: "nowrap",
                          borderTop: "1px solid #ddd",
                          textDecoration: "none",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          ...fontFamily,
                        }}
                      >
                        {person.organization_name}
                      </a>
                    </HoverableListItem>
                  )
                )}
              </ul>
            </div>

            <HoverableListItem
              component="a"
              href={`${pcoUrl(this.props.env)("login")}/logout`}
              onClick={() => {
                this.props.requestClearAppsCache();
                this.props.requestClearConnectedPeopleCache();
                return;
              }}
              data-turbolinks={false}
              style={{
                textAlign: "center",
                borderTop: "1px solid #ddd",
                lineHeight: "48px",
                display: "block",
                color: "#444",
                textDecoration: "none",
                ...fontFamily,
              }}
            >
              <svg
                style={{ marginRight: "12px" }}
                width="12px"
                height="10px"
                viewBox="0 0 12 10"
              >
                <g
                  id="Page-1"
                  stroke="none"
                  strokeWidth="1"
                  fill="none"
                  fillRule="evenodd"
                >
                  <g
                    id="Results-Copy"
                    transform="translate(-113.000000, -252.000000)"
                    fill="#444"
                  >
                    <path
                      d="M124.327628,256.578333 L122.013462,254.285 C121.870962,254.143333 121.683462,254.061667 121.486795,254.053333 C121.282628,254.045 121.092628,254.118333 120.950962,254.258333 C120.666795,254.54 120.666795,255.004167 120.950962,255.285833 L121.974295,256.255 L117.971795,256.255 C117.926795,256.255 117.884295,256.26 117.841795,256.268333 C117.489295,256.33 117.220962,256.633333 117.220962,257 C117.220962,257.410833 117.557628,257.745 117.971795,257.745 L121.990128,257.745 L120.950962,258.820833 C120.815128,258.955833 120.731795,259.1675 120.731795,259.374167 C120.731795,259.575833 120.813462,259.7775 120.950962,259.914167 C121.092628,260.055 121.281795,260.133333 121.480962,260.135833 C121.682628,260.1375 121.871795,260.061667 122.013462,259.920833 L124.327628,257.63 C124.610962,257.348333 124.610962,256.859167 124.327628,256.578333 M116.804167,260.523333 C116.7625,260.515 116.719167,260.510833 116.674167,260.510833 L114.5025,260.510833 L114.5025,253.489167 L116.6475,253.489167 C117.061667,253.489167 117.399167,253.155833 117.399167,252.745 C117.399167,252.378333 117.13,252.074167 116.7775,252.0125 C116.735,252.004167 116.6925,252 116.6475,252 L113.965,252 C113.540833,252 113,252.5075 113,252.904167 L113,261.308333 C113,261.736667 113.5625,262 113.965,262 L116.674167,262 C117.088333,262 117.425,261.665833 117.425,261.255 C117.425,260.889167 117.156667,260.585 116.804167,260.523333"
                      id="Fill-1"
                    />
                  </g>
                </g>
              </svg>
              Log out
            </HoverableListItem>
          </Popup>
        </PopupRoot>
      </StyledRoot>
    );
  }
}

export const Route = ({ active, style, name = "", ...props }) => (
  <HoverableListItem
    component="a"
    style={{
      paddingLeft: "16px",
      paddingRight: "16px",
      overflow: "hidden",
      verticalAlign: "middle",
      display: "flex",
      height: "48px",
      alignItems: "center",
      color: "#444",
      fontWeight: 600,
      minWidth: "6em",
      whiteSpace: "nowrap",
      textTransform: "capitalize",
      textDecoration: "none",
      lineHeight: "47px",
      ...fontFamily,
      ...style,
    }}
    key={name}
    data-turbolinks={false}
    {...props}
  />
);
