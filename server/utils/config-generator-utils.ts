import { writeFileSync, existsSync, mkdirSync } from "fs";
import yaml from "js-yaml";
import { getARecords } from "../controllers/dns/dns-dao.js";
import { DNS_CONFIG_DIR } from "./path-utils.js";
import { Zone } from "../model/data/zone.js";
import { IP } from "../model/data/ip.js";

const createDirIfNotExists = (dir: string) => {
  if (!existsSync(dir)) {
    mkdirSync(dir);
  }
};

const createDeploymentConfigs = (zones: Zone[]) => {
  const dirs = [
    DNS_CONFIG_DIR,
    DNS_CONFIG_DIR + "/cache",
    DNS_CONFIG_DIR + "/records",
    DNS_CONFIG_DIR + "/config",
  ];
  dirs.forEach((dir) => {
    createDirIfNotExists(dir);
  });

  const dockerComposeContents = getDockerComposeContents();
  writeFileSync(`${dirs[0]}/docker-compose.yml`, dockerComposeContents);

  const zoneNames = zones.map((zone) => zone.name);
  const namedConf = getNamedConf(zoneNames);
  writeFileSync(`${dirs[3]}/named.conf`, namedConf);

  zones.forEach(async (zone) => {
    const zoneFileContents = await getZoneFile(zone);
    writeFileSync(`${dirs[3]}/${zone.name}.zone`, zoneFileContents);
  });
};

const getDockerComposeContents = (): string => {
  const dockerCompose = {
    version: "3",
    services: {
      bind9: {
        container_name: "my-dns",
        image: "ubuntu/bind9:latest",
        environment: ["BIND9_USER=root", "TZ=America/Chicago"],
        ports: ["53:53/tcp", "53:53/udp"],
        volumes: [
          "./config:/etc/bind",
          "./cache:/var/cache/bind",
          "./records:/var/lib/bind",
        ],
      },
    },
  };

  return yaml.dump(dockerCompose);
};

const getNamedConf = (zoneNames: string[]): string => {
  let namedConf = `
options {
    forwarders {
        8.8.8.8;
        8.8.4.4;
    };
    allow-query { any; };
};\n\n`.trimStart();

  zoneNames.forEach((zoneName) => {
    namedConf += `
zone "${zoneName}" IN {
    type master;
    file "/etc/bind/${zoneName}.zone";
};\n\n`.trimStart();
  });

  return namedConf;
};

const ipObjectToString = (ipObj: IP): string => {
  return `${ipObj.part_0}.${ipObj.part_1}.${ipObj.part_2}.${ipObj.part_3}`;
};

const getZoneFile = async (zoneObj: Zone): Promise<string> => {
  let fourthColumnContents = [
    `ns.${zoneObj.name}.`,
    zoneObj.soa.serial,
    zoneObj.soa.refresh,
    zoneObj.soa.update_retry,
    zoneObj.soa.expire,
    zoneObj.soa.min_TTL,
    ipObjectToString(zoneObj.ip),
  ];
  let longestString = fourthColumnContents.reduce((acc, str) => {
    return str.length > acc ? str.length : acc;
  }, 0);
  let totalSpaces = longestString + 4;

  let zoneFileContents = `
$TTL 2d

$ORIGIN ${zoneObj.name}.

@        IN        SOA        ${fourthColumnContents[0]}${" ".repeat(
    totalSpaces - fourthColumnContents[0].length
  )}${zoneObj.soa.admin_email} (
                              ${fourthColumnContents[1]}${" ".repeat(
    totalSpaces - fourthColumnContents[1].length
  )}; serial
                              ${fourthColumnContents[2]}${" ".repeat(
    totalSpaces - fourthColumnContents[2].length
  )}; refresh
                              ${fourthColumnContents[3]}${" ".repeat(
    totalSpaces - fourthColumnContents[3].length
  )}; update retry
                              ${fourthColumnContents[4]}${" ".repeat(
    totalSpaces - fourthColumnContents[4].length
  )}; expire
                              ${fourthColumnContents[5]}${" ".repeat(
    totalSpaces - fourthColumnContents[4].length
  )}; minimum ttl
                              )
         IN        NS         ns.${zoneObj.name}.
ns       IN        A          ${ipObjectToString(zoneObj.ip)}


; -- add dns records below\n`.trimStart();

  const zone = await getARecords(zoneObj.name);
  const longestName = zone.a_records.reduce((acc, record) => {
    return record.name.length > acc ? record.name.length : acc;
  }, 0);
  totalSpaces = longestName + 4;
  zone.a_records.forEach((record) => {
    const aRecord = `
${record.name}${" ".repeat(
      totalSpaces - record.name.length
    )}IN        A        ${ipObjectToString(record.ip)}\n`.trimStart();

    zoneFileContents += aRecord;
  });

  return zoneFileContents;
};

export { createDeploymentConfigs };
