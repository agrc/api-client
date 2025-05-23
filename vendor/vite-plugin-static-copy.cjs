'use strict';
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all) __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if ((from && typeof from === 'object') || typeof from === 'function') {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, {
          get: () => from[key],
          enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable,
        });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (
  (target = mod != null ? __create(__getProtoOf(mod)) : {}),
  __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, 'default', { value: mod, enumerable: true }) : target,
    mod,
  )
);
var __toCommonJS = (mod) => __copyProps(__defProp({}, '__esModule', { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  viteStaticCopy: () => viteStaticCopy,
});
module.exports = __toCommonJS(src_exports);

// src/options.ts
var resolveOptions = (options) => {
  var _a, _b;
  return {
    targets: options.targets,
    structured: options.structured ?? false,
    silent: options.silent ?? false,
    watch: {
      options: ((_a = options.watch) == null ? void 0 : _a.options) ?? {},
      reloadPageOnChange: ((_b = options.watch) == null ? void 0 : _b.reloadPageOnChange) ?? false,
    },
  };
};

// node_modules/.pnpm/@polka+url@1.0.0-next.23/node_modules/@polka/url/build.mjs
var qs = __toESM(require('querystring'), 1);
function parse2(req) {
  let raw = req.url;
  if (raw == null) return;
  let prev = req._parsedUrl;
  if (prev && prev.raw === raw) return prev;
  let pathname = raw,
    search = '',
    query;
  if (raw.length > 1) {
    let idx = raw.indexOf('?', 1);
    if (idx !== -1) {
      search = raw.substring(idx);
      pathname = raw.substring(0, idx);
      if (search.length > 1) {
        query = qs.parse(search.substring(1));
      }
    }
  }
  return (req._parsedUrl = { pathname, search, query, raw });
}

// node_modules/.pnpm/mrmime@1.0.1/node_modules/mrmime/index.mjs
var mimes = {
  ez: 'application/andrew-inset',
  aw: 'application/applixware',
  atom: 'application/atom+xml',
  atomcat: 'application/atomcat+xml',
  atomdeleted: 'application/atomdeleted+xml',
  atomsvc: 'application/atomsvc+xml',
  dwd: 'application/atsc-dwd+xml',
  held: 'application/atsc-held+xml',
  rsat: 'application/atsc-rsat+xml',
  bdoc: 'application/bdoc',
  xcs: 'application/calendar+xml',
  ccxml: 'application/ccxml+xml',
  cdfx: 'application/cdfx+xml',
  cdmia: 'application/cdmi-capability',
  cdmic: 'application/cdmi-container',
  cdmid: 'application/cdmi-domain',
  cdmio: 'application/cdmi-object',
  cdmiq: 'application/cdmi-queue',
  cu: 'application/cu-seeme',
  mpd: 'application/dash+xml',
  davmount: 'application/davmount+xml',
  dbk: 'application/docbook+xml',
  dssc: 'application/dssc+der',
  xdssc: 'application/dssc+xml',
  es: 'application/ecmascript',
  ecma: 'application/ecmascript',
  emma: 'application/emma+xml',
  emotionml: 'application/emotionml+xml',
  epub: 'application/epub+zip',
  exi: 'application/exi',
  fdt: 'application/fdt+xml',
  pfr: 'application/font-tdpfr',
  geojson: 'application/geo+json',
  gml: 'application/gml+xml',
  gpx: 'application/gpx+xml',
  gxf: 'application/gxf',
  gz: 'application/gzip',
  hjson: 'application/hjson',
  stk: 'application/hyperstudio',
  ink: 'application/inkml+xml',
  inkml: 'application/inkml+xml',
  ipfix: 'application/ipfix',
  its: 'application/its+xml',
  jar: 'application/java-archive',
  war: 'application/java-archive',
  ear: 'application/java-archive',
  ser: 'application/java-serialized-object',
  class: 'application/java-vm',
  js: 'application/javascript',
  mjs: 'application/javascript',
  json: 'application/json',
  map: 'application/json',
  json5: 'application/json5',
  jsonml: 'application/jsonml+json',
  jsonld: 'application/ld+json',
  lgr: 'application/lgr+xml',
  lostxml: 'application/lost+xml',
  hqx: 'application/mac-binhex40',
  cpt: 'application/mac-compactpro',
  mads: 'application/mads+xml',
  webmanifest: 'application/manifest+json',
  mrc: 'application/marc',
  mrcx: 'application/marcxml+xml',
  ma: 'application/mathematica',
  nb: 'application/mathematica',
  mb: 'application/mathematica',
  mathml: 'application/mathml+xml',
  mbox: 'application/mbox',
  mscml: 'application/mediaservercontrol+xml',
  metalink: 'application/metalink+xml',
  meta4: 'application/metalink4+xml',
  mets: 'application/mets+xml',
  maei: 'application/mmt-aei+xml',
  musd: 'application/mmt-usd+xml',
  mods: 'application/mods+xml',
  m21: 'application/mp21',
  mp21: 'application/mp21',
  mp4s: 'application/mp4',
  m4p: 'application/mp4',
  doc: 'application/msword',
  dot: 'application/msword',
  mxf: 'application/mxf',
  nq: 'application/n-quads',
  nt: 'application/n-triples',
  cjs: 'application/node',
  bin: 'application/octet-stream',
  dms: 'application/octet-stream',
  lrf: 'application/octet-stream',
  mar: 'application/octet-stream',
  so: 'application/octet-stream',
  dist: 'application/octet-stream',
  distz: 'application/octet-stream',
  pkg: 'application/octet-stream',
  bpk: 'application/octet-stream',
  dump: 'application/octet-stream',
  elc: 'application/octet-stream',
  deploy: 'application/octet-stream',
  exe: 'application/octet-stream',
  dll: 'application/octet-stream',
  deb: 'application/octet-stream',
  dmg: 'application/octet-stream',
  iso: 'application/octet-stream',
  img: 'application/octet-stream',
  msi: 'application/octet-stream',
  msp: 'application/octet-stream',
  msm: 'application/octet-stream',
  buffer: 'application/octet-stream',
  oda: 'application/oda',
  opf: 'application/oebps-package+xml',
  ogx: 'application/ogg',
  omdoc: 'application/omdoc+xml',
  onetoc: 'application/onenote',
  onetoc2: 'application/onenote',
  onetmp: 'application/onenote',
  onepkg: 'application/onenote',
  oxps: 'application/oxps',
  relo: 'application/p2p-overlay+xml',
  xer: 'application/patch-ops-error+xml',
  pdf: 'application/pdf',
  pgp: 'application/pgp-encrypted',
  asc: 'application/pgp-signature',
  sig: 'application/pgp-signature',
  prf: 'application/pics-rules',
  p10: 'application/pkcs10',
  p7m: 'application/pkcs7-mime',
  p7c: 'application/pkcs7-mime',
  p7s: 'application/pkcs7-signature',
  p8: 'application/pkcs8',
  ac: 'application/pkix-attr-cert',
  cer: 'application/pkix-cert',
  crl: 'application/pkix-crl',
  pkipath: 'application/pkix-pkipath',
  pki: 'application/pkixcmp',
  pls: 'application/pls+xml',
  ai: 'application/postscript',
  eps: 'application/postscript',
  ps: 'application/postscript',
  provx: 'application/provenance+xml',
  cww: 'application/prs.cww',
  pskcxml: 'application/pskc+xml',
  raml: 'application/raml+yaml',
  rdf: 'application/rdf+xml',
  owl: 'application/rdf+xml',
  rif: 'application/reginfo+xml',
  rnc: 'application/relax-ng-compact-syntax',
  rl: 'application/resource-lists+xml',
  rld: 'application/resource-lists-diff+xml',
  rs: 'application/rls-services+xml',
  rapd: 'application/route-apd+xml',
  sls: 'application/route-s-tsid+xml',
  rusd: 'application/route-usd+xml',
  gbr: 'application/rpki-ghostbusters',
  mft: 'application/rpki-manifest',
  roa: 'application/rpki-roa',
  rsd: 'application/rsd+xml',
  rss: 'application/rss+xml',
  rtf: 'application/rtf',
  sbml: 'application/sbml+xml',
  scq: 'application/scvp-cv-request',
  scs: 'application/scvp-cv-response',
  spq: 'application/scvp-vp-request',
  spp: 'application/scvp-vp-response',
  sdp: 'application/sdp',
  senmlx: 'application/senml+xml',
  sensmlx: 'application/sensml+xml',
  setpay: 'application/set-payment-initiation',
  setreg: 'application/set-registration-initiation',
  shf: 'application/shf+xml',
  siv: 'application/sieve',
  sieve: 'application/sieve',
  smi: 'application/smil+xml',
  smil: 'application/smil+xml',
  rq: 'application/sparql-query',
  srx: 'application/sparql-results+xml',
  gram: 'application/srgs',
  grxml: 'application/srgs+xml',
  sru: 'application/sru+xml',
  ssdl: 'application/ssdl+xml',
  ssml: 'application/ssml+xml',
  swidtag: 'application/swid+xml',
  tei: 'application/tei+xml',
  teicorpus: 'application/tei+xml',
  tfi: 'application/thraud+xml',
  tsd: 'application/timestamped-data',
  toml: 'application/toml',
  trig: 'application/trig',
  ttml: 'application/ttml+xml',
  ubj: 'application/ubjson',
  rsheet: 'application/urc-ressheet+xml',
  td: 'application/urc-targetdesc+xml',
  vxml: 'application/voicexml+xml',
  wasm: 'application/wasm',
  wgt: 'application/widget',
  hlp: 'application/winhlp',
  wsdl: 'application/wsdl+xml',
  wspolicy: 'application/wspolicy+xml',
  xaml: 'application/xaml+xml',
  xav: 'application/xcap-att+xml',
  xca: 'application/xcap-caps+xml',
  xdf: 'application/xcap-diff+xml',
  xel: 'application/xcap-el+xml',
  xns: 'application/xcap-ns+xml',
  xenc: 'application/xenc+xml',
  xhtml: 'application/xhtml+xml',
  xht: 'application/xhtml+xml',
  xlf: 'application/xliff+xml',
  xml: 'application/xml',
  xsl: 'application/xml',
  xsd: 'application/xml',
  rng: 'application/xml',
  dtd: 'application/xml-dtd',
  xop: 'application/xop+xml',
  xpl: 'application/xproc+xml',
  xslt: 'application/xml',
  xspf: 'application/xspf+xml',
  mxml: 'application/xv+xml',
  xhvml: 'application/xv+xml',
  xvml: 'application/xv+xml',
  xvm: 'application/xv+xml',
  yang: 'application/yang',
  yin: 'application/yin+xml',
  zip: 'application/zip',
  '3gpp': 'video/3gpp',
  adp: 'audio/adpcm',
  amr: 'audio/amr',
  au: 'audio/basic',
  snd: 'audio/basic',
  mid: 'audio/midi',
  midi: 'audio/midi',
  kar: 'audio/midi',
  rmi: 'audio/midi',
  mxmf: 'audio/mobile-xmf',
  mp3: 'audio/mpeg',
  m4a: 'audio/mp4',
  mp4a: 'audio/mp4',
  mpga: 'audio/mpeg',
  mp2: 'audio/mpeg',
  mp2a: 'audio/mpeg',
  m2a: 'audio/mpeg',
  m3a: 'audio/mpeg',
  oga: 'audio/ogg',
  ogg: 'audio/ogg',
  spx: 'audio/ogg',
  opus: 'audio/ogg',
  s3m: 'audio/s3m',
  sil: 'audio/silk',
  wav: 'audio/wav',
  weba: 'audio/webm',
  xm: 'audio/xm',
  ttc: 'font/collection',
  otf: 'font/otf',
  ttf: 'font/ttf',
  woff: 'font/woff',
  woff2: 'font/woff2',
  exr: 'image/aces',
  apng: 'image/apng',
  avif: 'image/avif',
  bmp: 'image/bmp',
  cgm: 'image/cgm',
  drle: 'image/dicom-rle',
  emf: 'image/emf',
  fits: 'image/fits',
  g3: 'image/g3fax',
  gif: 'image/gif',
  heic: 'image/heic',
  heics: 'image/heic-sequence',
  heif: 'image/heif',
  heifs: 'image/heif-sequence',
  hej2: 'image/hej2k',
  hsj2: 'image/hsj2',
  ief: 'image/ief',
  jls: 'image/jls',
  jp2: 'image/jp2',
  jpg2: 'image/jp2',
  jpeg: 'image/jpeg',
  jpg: 'image/jpeg',
  jpe: 'image/jpeg',
  jph: 'image/jph',
  jhc: 'image/jphc',
  jpm: 'image/jpm',
  jpx: 'image/jpx',
  jpf: 'image/jpx',
  jxr: 'image/jxr',
  jxra: 'image/jxra',
  jxrs: 'image/jxrs',
  jxs: 'image/jxs',
  jxsc: 'image/jxsc',
  jxsi: 'image/jxsi',
  jxss: 'image/jxss',
  ktx: 'image/ktx',
  ktx2: 'image/ktx2',
  png: 'image/png',
  btif: 'image/prs.btif',
  pti: 'image/prs.pti',
  sgi: 'image/sgi',
  svg: 'image/svg+xml',
  svgz: 'image/svg+xml',
  t38: 'image/t38',
  tif: 'image/tiff',
  tiff: 'image/tiff',
  tfx: 'image/tiff-fx',
  webp: 'image/webp',
  wmf: 'image/wmf',
  'disposition-notification': 'message/disposition-notification',
  u8msg: 'message/global',
  u8dsn: 'message/global-delivery-status',
  u8mdn: 'message/global-disposition-notification',
  u8hdr: 'message/global-headers',
  eml: 'message/rfc822',
  mime: 'message/rfc822',
  '3mf': 'model/3mf',
  gltf: 'model/gltf+json',
  glb: 'model/gltf-binary',
  igs: 'model/iges',
  iges: 'model/iges',
  msh: 'model/mesh',
  mesh: 'model/mesh',
  silo: 'model/mesh',
  mtl: 'model/mtl',
  obj: 'model/obj',
  stpz: 'model/step+zip',
  stpxz: 'model/step-xml+zip',
  stl: 'model/stl',
  wrl: 'model/vrml',
  vrml: 'model/vrml',
  x3db: 'model/x3d+fastinfoset',
  x3dbz: 'model/x3d+binary',
  x3dv: 'model/x3d-vrml',
  x3dvz: 'model/x3d+vrml',
  x3d: 'model/x3d+xml',
  x3dz: 'model/x3d+xml',
  appcache: 'text/cache-manifest',
  manifest: 'text/cache-manifest',
  ics: 'text/calendar',
  ifb: 'text/calendar',
  coffee: 'text/coffeescript',
  litcoffee: 'text/coffeescript',
  css: 'text/css',
  csv: 'text/csv',
  html: 'text/html',
  htm: 'text/html',
  shtml: 'text/html',
  jade: 'text/jade',
  jsx: 'text/jsx',
  less: 'text/less',
  markdown: 'text/markdown',
  md: 'text/markdown',
  mml: 'text/mathml',
  mdx: 'text/mdx',
  n3: 'text/n3',
  txt: 'text/plain',
  text: 'text/plain',
  conf: 'text/plain',
  def: 'text/plain',
  list: 'text/plain',
  log: 'text/plain',
  in: 'text/plain',
  ini: 'text/plain',
  dsc: 'text/prs.lines.tag',
  rtx: 'text/richtext',
  sgml: 'text/sgml',
  sgm: 'text/sgml',
  shex: 'text/shex',
  slim: 'text/slim',
  slm: 'text/slim',
  spdx: 'text/spdx',
  stylus: 'text/stylus',
  styl: 'text/stylus',
  tsv: 'text/tab-separated-values',
  t: 'text/troff',
  tr: 'text/troff',
  roff: 'text/troff',
  man: 'text/troff',
  me: 'text/troff',
  ms: 'text/troff',
  ttl: 'text/turtle',
  uri: 'text/uri-list',
  uris: 'text/uri-list',
  urls: 'text/uri-list',
  vcard: 'text/vcard',
  vtt: 'text/vtt',
  yaml: 'text/yaml',
  yml: 'text/yaml',
  '3gp': 'video/3gpp',
  '3g2': 'video/3gpp2',
  h261: 'video/h261',
  h263: 'video/h263',
  h264: 'video/h264',
  m4s: 'video/iso.segment',
  jpgv: 'video/jpeg',
  jpgm: 'image/jpm',
  mj2: 'video/mj2',
  mjp2: 'video/mj2',
  ts: 'video/mp2t',
  mp4: 'video/mp4',
  mp4v: 'video/mp4',
  mpg4: 'video/mp4',
  mpeg: 'video/mpeg',
  mpg: 'video/mpeg',
  mpe: 'video/mpeg',
  m1v: 'video/mpeg',
  m2v: 'video/mpeg',
  ogv: 'video/ogg',
  qt: 'video/quicktime',
  mov: 'video/quicktime',
  webm: 'video/webm',
};
function lookup(extn) {
  let tmp = ('' + extn).trim().toLowerCase();
  let idx = tmp.lastIndexOf('.');
  return mimes[!~idx ? tmp : tmp.substring(++idx)];
}

// src/middleware.ts
var import_node_fs = require('fs');
var import_node_path2 = require('path');

// src/utils.ts
var import_fast_glob = __toESM(require('fast-glob'), 1);
var import_node_path = __toESM(require('path'), 1);
var import_fs_extra = __toESM(require('fs-extra'), 1);
var import_picocolors = __toESM(require('picocolors'), 1);
var import_node_crypto = require('crypto');
async function renameTarget(target, rename, src) {
  const parsedPath = import_node_path.default.parse(target);
  if (typeof rename === 'string') {
    return rename;
  }
  return rename(parsedPath.name, parsedPath.ext.replace('.', ''), src);
}
var collectCopyTargets = async (root, targets, structured) => {
  const copyTargets = [];
  for (const target of targets) {
    const { src, dest, rename, transform, preserveTimestamps, dereference, overwrite } = target;
    const matchedPaths = await (0, import_fast_glob.default)(src, {
      onlyFiles: false,
      dot: true,
      cwd: root,
    });
    for (const matchedPath of matchedPaths) {
      if (transform) {
        const srcStat = await import_fs_extra.default.stat(import_node_path.default.resolve(root, matchedPath));
        if (!srcStat.isFile()) {
          throw new Error(`"transform" option only supports a file: '${matchedPath}' is not a file`);
        }
      }
      const { base, dir } = import_node_path.default.parse(matchedPath);
      let destDir;
      if (!structured || !dir) {
        destDir = dest;
      } else {
        const dirClean = dir.replace(/^(?:\.\.\/)+/, '');
        const destClean = `${dest}/${dirClean}`.replace(/^\/+|\/+$/g, '');
        destDir = destClean;
      }
      copyTargets.push({
        src: matchedPath,
        dest: import_node_path.default.join(destDir, rename ? await renameTarget(base, rename, matchedPath) : base),
        transform,
        preserveTimestamps: preserveTimestamps ?? false,
        dereference: dereference ?? true,
        overwrite: overwrite ?? true,
      });
    }
  }
  return copyTargets;
};
async function getTransformedContent(file, transform) {
  if (transform.encoding === 'buffer') {
    const content2 = await import_fs_extra.default.readFile(file);
    return transform.handler(content2, file);
  }
  const content = await import_fs_extra.default.readFile(file, transform.encoding);
  return transform.handler(content, file);
}
async function transformCopy(transform, src, dest, overwrite) {
  if (overwrite === false || overwrite === 'error') {
    const exists = await fsExists(dest);
    if (exists) {
      if (overwrite === false) {
        return { copied: false };
      }
      if (overwrite === 'error') {
        throw new Error(`File ${dest} already exists`);
      }
    }
  }
  const transformedContent = await getTransformedContent(src, transform);
  if (transformedContent === null) {
    return { copied: false };
  }
  await import_fs_extra.default.outputFile(dest, transformedContent);
  return { copied: true };
}
var copyAll = async (rootSrc, rootDest, targets, structured) => {
  const copyTargets = await collectCopyTargets(rootSrc, targets, structured);
  let copiedCount = 0;
  for (const copyTarget of copyTargets) {
    const { src, dest, transform, preserveTimestamps, dereference, overwrite } = copyTarget;
    const resolvedSrc = import_node_path.default.resolve(rootSrc, src);
    const resolvedDest = import_node_path.default.resolve(rootSrc, rootDest, dest);
    const transformOption = resolveTransformOption(transform);
    if (transformOption) {
      const result = await transformCopy(transformOption, resolvedSrc, resolvedDest, overwrite);
      if (result.copied) {
        copiedCount++;
      }
    } else {
      await import_fs_extra.default.copy(resolvedSrc, resolvedDest, {
        preserveTimestamps,
        dereference,
        overwrite: overwrite === true,
        errorOnExist: overwrite === 'error',
      });
      copiedCount++;
    }
  }
  return { targets: copyTargets.length, copied: copiedCount };
};
var updateFileMapFromTargets = (targets, fileMap) => {
  fileMap.clear();
  for (const target of [...targets].reverse()) {
    let dest = target.dest.replace(/\\/g, '/');
    if (!dest.startsWith('/')) {
      dest = `/${dest}`;
    }
    if (!fileMap.has(dest)) {
      fileMap.set(dest, []);
    }
    fileMap.get(dest).push({
      src: target.src,
      dest: target.dest,
      overwrite: target.overwrite,
      transform: target.transform,
    });
  }
};
var calculateMd5Base64 = (content) => (0, import_node_crypto.createHash)('md5').update(content).digest('base64');
var formatConsole = (msg) => `${import_picocolors.default.cyan('[vite-plugin-static-copy]')} ${msg}`;
var outputCollectedLog = (logger, collectedMap) => {
  if (collectedMap.size > 0) {
    logger.info(formatConsole(import_picocolors.default.green(`Collected ${collectedMap.size} items.`)));
    if (process.env.DEBUG === 'vite:plugin-static-copy') {
      for (const [key, vals] of collectedMap) {
        for (const val of vals) {
          logger.info(formatConsole(`  - '${key}' -> '${val.src}'${val.transform ? ' (with content transform)' : ''}`));
        }
      }
    }
  } else {
    logger.warn(formatConsole(import_picocolors.default.yellow('No items found.')));
  }
};
var outputCopyLog = (logger, result) => {
  if (result.targets > 0) {
    const copiedMessage = import_picocolors.default.green(`Copied ${result.copied} items.`);
    const skipped = result.targets - result.copied;
    const skippedMessage = skipped > 0 ? ` ${import_picocolors.default.gray(`(Skipped ${skipped} items.)`)}` : '';
    logger.info(formatConsole(`${copiedMessage}${skippedMessage}`));
  } else {
    logger.warn(formatConsole(import_picocolors.default.yellow('No items to copy.')));
  }
};
function resolveTransformOption(transformOption) {
  if (typeof transformOption === 'function') {
    return {
      handler: transformOption,
      encoding: 'utf8',
    };
  }
  return transformOption;
}
async function fsExists(p) {
  try {
    await import_fs_extra.default.stat(p);
  } catch (e) {
    if (e.code === 'ENOENT') {
      return false;
    }
    throw e;
  }
  return true;
}

// src/middleware.ts
function shouldServeOverwriteCheck(overwrite, srcAbsolutePath, root, publicDir, dest) {
  const publicDirDisabled = publicDir === '';
  if (overwrite === true || publicDirDisabled) {
    return true;
  }
  const publicFile = (0, import_node_path2.resolve)(publicDir, dest);
  if ((0, import_node_fs.existsSync)(publicFile)) {
    if (overwrite === 'error' && (0, import_node_fs.existsSync)(srcAbsolutePath)) {
      const destAbsolutePath = (0, import_node_path2.resolve)(root, dest);
      throw new Error(
        `File ${destAbsolutePath} will be copied from ${publicFile} (overwrite option is set to "error")`,
      );
    }
    return false;
  }
  return true;
}
function viaLocal(root, publicDir, fileMap, uri) {
  if (uri.endsWith('/')) {
    uri = uri.slice(0, -1);
  }
  const files = fileMap.get(uri);
  if (files && files[0]) {
    const file = files[0];
    const filepath = (0, import_node_path2.resolve)(root, file.src);
    const overwriteCheck = shouldServeOverwriteCheck(file.overwrite, filepath, root, publicDir, file.dest);
    if (overwriteCheck === false) {
      return void 0;
    }
    const stats = (0, import_node_fs.statSync)(filepath);
    return { filepath, stats, transform: file.transform };
  }
  for (const [key, vals] of fileMap) {
    const dir = key.endsWith('/') ? key : `${key}/`;
    if (!uri.startsWith(dir)) continue;
    for (const val of vals) {
      const filepath = (0, import_node_path2.resolve)(root, val.src, uri.slice(dir.length));
      const overwriteCheck = shouldServeOverwriteCheck(
        val.overwrite,
        filepath,
        root,
        publicDir,
        (0, import_node_path2.join)(val.dest, uri.slice(dir.length)),
      );
      if (overwriteCheck === false) {
        return void 0;
      }
      const stats = (0, import_node_fs.statSync)(filepath, { throwIfNoEntry: false });
      if (stats) {
        return { filepath, stats };
      }
    }
    return void 0;
  }
  return void 0;
}
function getStaticHeaders(name, stats) {
  let ctype = lookup(name) || '';
  if (ctype === 'text/html') ctype += ';charset=utf-8';
  const headers = {
    'Content-Length': stats.size,
    'Content-Type': ctype,
    'Last-Modified': stats.mtime.toUTCString(),
    ETag: `W/"${stats.size}-${stats.mtime.getTime()}"`,
    'Cache-Control': 'no-cache',
  };
  return headers;
}
function getTransformHeaders(name, encoding, content) {
  let ctype = lookup(name) || '';
  if (ctype === 'text/html') ctype += ';charset=utf-8';
  const headers = {
    'Content-Length': Buffer.byteLength(content, encoding === 'buffer' ? void 0 : encoding),
    'Content-Type': ctype,
    ETag: `W/"${calculateMd5Base64(content)}"`,
    'Cache-Control': 'no-cache',
  };
  return headers;
}
function getMergeHeaders(headers, res) {
  headers = { ...headers };
  for (const key in headers) {
    const tmp = res.getHeader(key);
    if (tmp) headers[key] = tmp;
  }
  const contentTypeHeader = res.getHeader('content-type');
  if (contentTypeHeader) {
    headers['Content-Type'] = contentTypeHeader;
  }
  return headers;
}
function sendStatic(req, res, file, stats) {
  const staticHeaders = getStaticHeaders(file, stats);
  if (req.headers['if-none-match'] === staticHeaders['ETag']) {
    res.writeHead(304);
    res.end();
    return;
  }
  let code = 200;
  const headers = getMergeHeaders(staticHeaders, res);
  const opts = {};
  if (req.headers.range) {
    code = 206;
    const [x, y] = req.headers.range.replace('bytes=', '').split('-');
    let end = (y ? parseInt(y, 10) : 0) || stats.size - 1;
    const start = (x ? parseInt(x, 10) : 0) || 0;
    opts.end = end;
    opts.start = start;
    if (end >= stats.size) {
      end = stats.size - 1;
    }
    if (start >= stats.size) {
      res.setHeader('Content-Range', `bytes */${stats.size}`);
      res.statusCode = 416;
      res.end();
      return;
    }
    headers['Content-Range'] = `bytes ${start}-${end}/${stats.size}`;
    headers['Content-Length'] = end - start + 1;
    headers['Accept-Ranges'] = 'bytes';
  }
  res.writeHead(code, headers);
  (0, import_node_fs.createReadStream)(file, opts).pipe(res);
}
async function sendTransform(req, res, file, transform) {
  const transformedContent = await getTransformedContent(file, transform);
  if (transformedContent === null) {
    return false;
  }
  const transformHeaders = getTransformHeaders(file, transform.encoding, transformedContent);
  if (req.headers['if-none-match'] === transformHeaders['ETag']) {
    res.writeHead(304);
    res.end();
    return true;
  }
  const code = 200;
  const headers = getMergeHeaders(transformHeaders, res);
  res.writeHead(code, headers);
  res.end(transformedContent);
  return true;
}
function return404(res, next) {
  if (next) {
    next();
    return;
  }
  res.statusCode = 404;
  res.end();
}
function serveStaticCopyMiddleware({ root, publicDir }, fileMap) {
  return async function viteServeStaticCopyMiddleware(req, res, next) {
    let pathname = parse2(req).pathname;
    if (pathname.includes('%')) {
      try {
        pathname = decodeURI(pathname);
      } catch (err) {}
    }
    try {
      const data = viaLocal(root, publicDir, fileMap, pathname);
      if (!data) {
        return404(res, next);
        return;
      }
      if (/\.[tj]sx?$/.test(pathname)) {
        res.setHeader('Content-Type', 'application/javascript');
      }
      const transformOption = resolveTransformOption(data.transform);
      if (transformOption) {
        const sent = await sendTransform(req, res, data.filepath, transformOption);
        if (!sent) {
          return404(res, next);
          return;
        }
        return;
      }
      sendStatic(req, res, data.filepath, data.stats);
    } catch (e) {
      if (e instanceof Error) {
        next(e);
        return;
      }
      throw e;
    }
  };
}

// node_modules/.pnpm/throttle-debounce@5.0.0/node_modules/throttle-debounce/esm/index.js
function throttle(delay, callback, options) {
  var _ref = options || {},
    _ref$noTrailing = _ref.noTrailing,
    noTrailing = _ref$noTrailing === void 0 ? false : _ref$noTrailing,
    _ref$noLeading = _ref.noLeading,
    noLeading = _ref$noLeading === void 0 ? false : _ref$noLeading,
    _ref$debounceMode = _ref.debounceMode,
    debounceMode = _ref$debounceMode === void 0 ? void 0 : _ref$debounceMode;
  var timeoutID;
  var cancelled = false;
  var lastExec = 0;
  function clearExistingTimeout() {
    if (timeoutID) {
      clearTimeout(timeoutID);
    }
  }
  function cancel(options2) {
    var _ref2 = options2 || {},
      _ref2$upcomingOnly = _ref2.upcomingOnly,
      upcomingOnly = _ref2$upcomingOnly === void 0 ? false : _ref2$upcomingOnly;
    clearExistingTimeout();
    cancelled = !upcomingOnly;
  }
  function wrapper() {
    for (var _len = arguments.length, arguments_ = new Array(_len), _key = 0; _key < _len; _key++) {
      arguments_[_key] = arguments[_key];
    }
    var self = this;
    var elapsed = Date.now() - lastExec;
    if (cancelled) {
      return;
    }
    function exec() {
      lastExec = Date.now();
      callback.apply(self, arguments_);
    }
    function clear() {
      timeoutID = void 0;
    }
    if (!noLeading && debounceMode && !timeoutID) {
      exec();
    }
    clearExistingTimeout();
    if (debounceMode === void 0 && elapsed > delay) {
      if (noLeading) {
        lastExec = Date.now();
        if (!noTrailing) {
          timeoutID = setTimeout(debounceMode ? clear : exec, delay);
        }
      } else {
        exec();
      }
    } else if (noTrailing !== true) {
      timeoutID = setTimeout(debounceMode ? clear : exec, debounceMode === void 0 ? delay - elapsed : delay);
    }
  }
  wrapper.cancel = cancel;
  return wrapper;
}
function debounce(delay, callback, options) {
  var _ref = options || {},
    _ref$atBegin = _ref.atBegin,
    atBegin = _ref$atBegin === void 0 ? false : _ref$atBegin;
  return throttle(delay, callback, {
    debounceMode: atBegin !== false,
  });
}

// src/serve.ts
var import_chokidar = __toESM(require('chokidar'), 1);
var import_picocolors2 = __toESM(require('picocolors'), 1);
var servePlugin = ({ targets, structured, watch, silent }) => {
  let config;
  let watcher;
  const fileMap = /* @__PURE__ */ new Map();
  const collectFileMap = async () => {
    try {
      const copyTargets = await collectCopyTargets(config.root, targets, structured);
      updateFileMapFromTargets(copyTargets, fileMap);
    } catch (e) {
      config.logger.error(formatConsole(import_picocolors2.default.red(e.toString())));
    }
  };
  const collectFileMapDebounce = debounce(100, async () => {
    await collectFileMap();
  });
  return {
    name: 'vite-plugin-static-copy:serve',
    apply: 'serve',
    configResolved(_config) {
      config = _config;
    },
    async buildStart() {
      await collectFileMap();
    },
    configureServer({ httpServer, middlewares, ws }) {
      const reloadPage = () => {
        ws.send({ type: 'full-reload', path: '*' });
      };
      watcher = import_chokidar.default.watch(
        targets.flatMap((target) => target.src),
        {
          cwd: config.root,
          ignoreInitial: true,
          ...watch.options,
        },
      );
      watcher.on('add', async (path2) => {
        if (!silent) {
          config.logger.info(formatConsole(`${import_picocolors2.default.green('detected new file')} ${path2}`), {
            timestamp: true,
          });
        }
        await collectFileMapDebounce();
        if (watch.reloadPageOnChange) {
          reloadPage();
        }
      });
      if (watch.reloadPageOnChange) {
        watcher.on('change', (path2) => {
          if (!silent) {
            config.logger.info(formatConsole(`${import_picocolors2.default.green('file changed')} ${path2}`), {
              timestamp: true,
            });
          }
          reloadPage();
        });
        watcher.on('unlink', (path2) => {
          if (!silent) {
            config.logger.info(formatConsole(`${import_picocolors2.default.green('file deleted')} ${path2}`), {
              timestamp: true,
            });
          }
          reloadPage();
        });
      }
      if (!silent) {
        httpServer == null
          ? void 0
          : httpServer.once('listening', () => {
              setTimeout(() => {
                outputCollectedLog(config.logger, fileMap);
              }, 0);
            });
      }
      return () => {
        middlewares.use(serveStaticCopyMiddleware(config, fileMap));
        const targetMiddlewareIndex = findMiddlewareIndex(middlewares.stack, [
          'viteServePublicMiddleware',
          'viteTransformMiddleware',
        ]);
        const serveStaticCopyMiddlewareIndex = findMiddlewareIndex(middlewares.stack, 'viteServeStaticCopyMiddleware');
        const serveStaticCopyMiddlewareItem = middlewares.stack.splice(serveStaticCopyMiddlewareIndex, 1)[0];
        if (serveStaticCopyMiddlewareItem === void 0) throw new Error();
        middlewares.stack.splice(targetMiddlewareIndex, 0, serveStaticCopyMiddlewareItem);
      };
    },
    async closeBundle() {
      await watcher.close();
    },
  };
};
var findMiddlewareIndex = (stack, names) => {
  const ns = Array.isArray(names) ? names : [names];
  for (const name of ns) {
    const index = stack.findIndex(
      (middleware) => typeof middleware.handle === 'function' && middleware.handle.name === name,
    );
    if (index > 0) {
      return index;
    }
  }
  return -1;
};

// src/build.ts
var buildPlugin = ({ targets, structured, silent }) => {
  let config;
  return {
    name: 'vite-plugin-static-copy:build',
    apply: 'build',
    configResolved(_config) {
      config = _config;
    },
    async writeBundle() {
      const result = await copyAll(config.root, config.build.outDir, targets, structured);
      if (!silent) outputCopyLog(config.logger, result);
    },
  };
};

// src/index.ts
var viteStaticCopy = (options) => {
  const resolvedOptions = resolveOptions(options);
  return [servePlugin(resolvedOptions), buildPlugin(resolvedOptions)];
};
// Annotate the CommonJS export names for ESM import in node:
0 &&
  (module.exports = {
    viteStaticCopy,
  });
