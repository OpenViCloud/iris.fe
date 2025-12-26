const GATEWAY_BASE = process.env.NEXT_PUBLIC_GATEWAY_BASE;

const apiLinks = {
  account: {
    info: `${GATEWAY_BASE}/account/info`,
    login: `${GATEWAY_BASE}/account/login`,
    logout: `${GATEWAY_BASE}/account/logout`
  },
  apps: {
    getApps: `${GATEWAY_BASE}/iris/api/apps`,
  },
};

export default apiLinks;
