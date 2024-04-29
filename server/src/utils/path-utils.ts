const PIPE_COMM_DIR = process.env.PIPE_COMM_DIR || "./pipe-comm";
const PIPE_PATH = process.env.PIPE_PATH || "./command-runner";
const DNS_CONFIG_DIR = process.env.DNS_CONFIG_DIR || "./dns-config";
const HOST_DNS_CONFIG_DIR = process.env.HOST_DNS_CONFIG_DIR || DNS_CONFIG_DIR;

export { PIPE_COMM_DIR, PIPE_PATH, DNS_CONFIG_DIR, HOST_DNS_CONFIG_DIR };
