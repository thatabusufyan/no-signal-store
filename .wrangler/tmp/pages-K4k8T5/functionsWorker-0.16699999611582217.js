var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// ../../../../usr/lib/node_modules/wrangler/node_modules/unenv/dist/runtime/_internal/utils.mjs
// @__NO_SIDE_EFFECTS__
function createNotImplementedError(name) {
  return new Error(`[unenv] ${name} is not implemented yet!`);
}
__name(createNotImplementedError, "createNotImplementedError");
// @__NO_SIDE_EFFECTS__
function notImplemented(name) {
  const fn = /* @__PURE__ */ __name(() => {
    throw /* @__PURE__ */ createNotImplementedError(name);
  }, "fn");
  return Object.assign(fn, { __unenv__: true });
}
__name(notImplemented, "notImplemented");
// @__NO_SIDE_EFFECTS__
function notImplementedClass(name) {
  return class {
    __unenv__ = true;
    constructor() {
      throw new Error(`[unenv] ${name} is not implemented yet!`);
    }
  };
}
__name(notImplementedClass, "notImplementedClass");

// ../../../../usr/lib/node_modules/wrangler/node_modules/unenv/dist/runtime/node/internal/perf_hooks/performance.mjs
var _timeOrigin = globalThis.performance?.timeOrigin ?? Date.now();
var _performanceNow = globalThis.performance?.now ? globalThis.performance.now.bind(globalThis.performance) : () => Date.now() - _timeOrigin;
var nodeTiming = {
  name: "node",
  entryType: "node",
  startTime: 0,
  duration: 0,
  nodeStart: 0,
  v8Start: 0,
  bootstrapComplete: 0,
  environment: 0,
  loopStart: 0,
  loopExit: 0,
  idleTime: 0,
  uvMetricsInfo: {
    loopCount: 0,
    events: 0,
    eventsWaiting: 0
  },
  detail: void 0,
  toJSON() {
    return this;
  }
};
var PerformanceEntry = class {
  static {
    __name(this, "PerformanceEntry");
  }
  __unenv__ = true;
  detail;
  entryType = "event";
  name;
  startTime;
  constructor(name, options) {
    this.name = name;
    this.startTime = options?.startTime || _performanceNow();
    this.detail = options?.detail;
  }
  get duration() {
    return _performanceNow() - this.startTime;
  }
  toJSON() {
    return {
      name: this.name,
      entryType: this.entryType,
      startTime: this.startTime,
      duration: this.duration,
      detail: this.detail
    };
  }
};
var PerformanceMark = class PerformanceMark2 extends PerformanceEntry {
  static {
    __name(this, "PerformanceMark");
  }
  entryType = "mark";
  constructor() {
    super(...arguments);
  }
  get duration() {
    return 0;
  }
};
var PerformanceMeasure = class extends PerformanceEntry {
  static {
    __name(this, "PerformanceMeasure");
  }
  entryType = "measure";
};
var PerformanceResourceTiming = class extends PerformanceEntry {
  static {
    __name(this, "PerformanceResourceTiming");
  }
  entryType = "resource";
  serverTiming = [];
  connectEnd = 0;
  connectStart = 0;
  decodedBodySize = 0;
  domainLookupEnd = 0;
  domainLookupStart = 0;
  encodedBodySize = 0;
  fetchStart = 0;
  initiatorType = "";
  name = "";
  nextHopProtocol = "";
  redirectEnd = 0;
  redirectStart = 0;
  requestStart = 0;
  responseEnd = 0;
  responseStart = 0;
  secureConnectionStart = 0;
  startTime = 0;
  transferSize = 0;
  workerStart = 0;
  responseStatus = 0;
};
var PerformanceObserverEntryList = class {
  static {
    __name(this, "PerformanceObserverEntryList");
  }
  __unenv__ = true;
  getEntries() {
    return [];
  }
  getEntriesByName(_name, _type) {
    return [];
  }
  getEntriesByType(type) {
    return [];
  }
};
var Performance = class {
  static {
    __name(this, "Performance");
  }
  __unenv__ = true;
  timeOrigin = _timeOrigin;
  eventCounts = /* @__PURE__ */ new Map();
  _entries = [];
  _resourceTimingBufferSize = 0;
  navigation = void 0;
  timing = void 0;
  timerify(_fn, _options) {
    throw createNotImplementedError("Performance.timerify");
  }
  get nodeTiming() {
    return nodeTiming;
  }
  eventLoopUtilization() {
    return {};
  }
  markResourceTiming() {
    return new PerformanceResourceTiming("");
  }
  onresourcetimingbufferfull = null;
  now() {
    if (this.timeOrigin === _timeOrigin) {
      return _performanceNow();
    }
    return Date.now() - this.timeOrigin;
  }
  clearMarks(markName) {
    this._entries = markName ? this._entries.filter((e) => e.name !== markName) : this._entries.filter((e) => e.entryType !== "mark");
  }
  clearMeasures(measureName) {
    this._entries = measureName ? this._entries.filter((e) => e.name !== measureName) : this._entries.filter((e) => e.entryType !== "measure");
  }
  clearResourceTimings() {
    this._entries = this._entries.filter((e) => e.entryType !== "resource" || e.entryType !== "navigation");
  }
  getEntries() {
    return this._entries;
  }
  getEntriesByName(name, type) {
    return this._entries.filter((e) => e.name === name && (!type || e.entryType === type));
  }
  getEntriesByType(type) {
    return this._entries.filter((e) => e.entryType === type);
  }
  mark(name, options) {
    const entry = new PerformanceMark(name, options);
    this._entries.push(entry);
    return entry;
  }
  measure(measureName, startOrMeasureOptions, endMark) {
    let start;
    let end;
    if (typeof startOrMeasureOptions === "string") {
      start = this.getEntriesByName(startOrMeasureOptions, "mark")[0]?.startTime;
      end = this.getEntriesByName(endMark, "mark")[0]?.startTime;
    } else {
      start = Number.parseFloat(startOrMeasureOptions?.start) || this.now();
      end = Number.parseFloat(startOrMeasureOptions?.end) || this.now();
    }
    const entry = new PerformanceMeasure(measureName, {
      startTime: start,
      detail: {
        start,
        end
      }
    });
    this._entries.push(entry);
    return entry;
  }
  setResourceTimingBufferSize(maxSize) {
    this._resourceTimingBufferSize = maxSize;
  }
  addEventListener(type, listener, options) {
    throw createNotImplementedError("Performance.addEventListener");
  }
  removeEventListener(type, listener, options) {
    throw createNotImplementedError("Performance.removeEventListener");
  }
  dispatchEvent(event) {
    throw createNotImplementedError("Performance.dispatchEvent");
  }
  toJSON() {
    return this;
  }
};
var PerformanceObserver = class {
  static {
    __name(this, "PerformanceObserver");
  }
  __unenv__ = true;
  static supportedEntryTypes = [];
  _callback = null;
  constructor(callback) {
    this._callback = callback;
  }
  takeRecords() {
    return [];
  }
  disconnect() {
    throw createNotImplementedError("PerformanceObserver.disconnect");
  }
  observe(options) {
    throw createNotImplementedError("PerformanceObserver.observe");
  }
  bind(fn) {
    return fn;
  }
  runInAsyncScope(fn, thisArg, ...args) {
    return fn.call(thisArg, ...args);
  }
  asyncId() {
    return 0;
  }
  triggerAsyncId() {
    return 0;
  }
  emitDestroy() {
    return this;
  }
};
var performance = globalThis.performance && "addEventListener" in globalThis.performance ? globalThis.performance : new Performance();

// ../../../../usr/lib/node_modules/wrangler/node_modules/@cloudflare/unenv-preset/dist/runtime/polyfill/performance.mjs
if (!("__unenv__" in performance)) {
  const proto = Performance.prototype;
  for (const key2 of Object.getOwnPropertyNames(proto)) {
    if (key2 !== "constructor" && !(key2 in performance)) {
      const desc = Object.getOwnPropertyDescriptor(proto, key2);
      if (desc) {
        Object.defineProperty(performance, key2, desc);
      }
    }
  }
}
globalThis.performance = performance;
globalThis.Performance = Performance;
globalThis.PerformanceEntry = PerformanceEntry;
globalThis.PerformanceMark = PerformanceMark;
globalThis.PerformanceMeasure = PerformanceMeasure;
globalThis.PerformanceObserver = PerformanceObserver;
globalThis.PerformanceObserverEntryList = PerformanceObserverEntryList;
globalThis.PerformanceResourceTiming = PerformanceResourceTiming;

// ../../../../usr/lib/node_modules/wrangler/node_modules/unenv/dist/runtime/node/console.mjs
import { Writable } from "node:stream";

// ../../../../usr/lib/node_modules/wrangler/node_modules/unenv/dist/runtime/mock/noop.mjs
var noop_default = Object.assign(() => {
}, { __unenv__: true });

// ../../../../usr/lib/node_modules/wrangler/node_modules/unenv/dist/runtime/node/console.mjs
var _console = globalThis.console;
var _ignoreErrors = true;
var _stderr = new Writable();
var _stdout = new Writable();
var log = _console?.log ?? noop_default;
var info = _console?.info ?? log;
var trace = _console?.trace ?? info;
var debug = _console?.debug ?? log;
var table = _console?.table ?? log;
var error = _console?.error ?? log;
var warn = _console?.warn ?? error;
var createTask = _console?.createTask ?? /* @__PURE__ */ notImplemented("console.createTask");
var clear = _console?.clear ?? noop_default;
var count = _console?.count ?? noop_default;
var countReset = _console?.countReset ?? noop_default;
var dir = _console?.dir ?? noop_default;
var dirxml = _console?.dirxml ?? noop_default;
var group = _console?.group ?? noop_default;
var groupEnd = _console?.groupEnd ?? noop_default;
var groupCollapsed = _console?.groupCollapsed ?? noop_default;
var profile = _console?.profile ?? noop_default;
var profileEnd = _console?.profileEnd ?? noop_default;
var time = _console?.time ?? noop_default;
var timeEnd = _console?.timeEnd ?? noop_default;
var timeLog = _console?.timeLog ?? noop_default;
var timeStamp = _console?.timeStamp ?? noop_default;
var Console = _console?.Console ?? /* @__PURE__ */ notImplementedClass("console.Console");
var _times = /* @__PURE__ */ new Map();
var _stdoutErrorHandler = noop_default;
var _stderrErrorHandler = noop_default;

// ../../../../usr/lib/node_modules/wrangler/node_modules/@cloudflare/unenv-preset/dist/runtime/node/console.mjs
var workerdConsole = globalThis["console"];
var {
  assert,
  clear: clear2,
  // @ts-expect-error undocumented public API
  context,
  count: count2,
  countReset: countReset2,
  // @ts-expect-error undocumented public API
  createTask: createTask2,
  debug: debug2,
  dir: dir2,
  dirxml: dirxml2,
  error: error2,
  group: group2,
  groupCollapsed: groupCollapsed2,
  groupEnd: groupEnd2,
  info: info2,
  log: log2,
  profile: profile2,
  profileEnd: profileEnd2,
  table: table2,
  time: time2,
  timeEnd: timeEnd2,
  timeLog: timeLog2,
  timeStamp: timeStamp2,
  trace: trace2,
  warn: warn2
} = workerdConsole;
Object.assign(workerdConsole, {
  Console,
  _ignoreErrors,
  _stderr,
  _stderrErrorHandler,
  _stdout,
  _stdoutErrorHandler,
  _times
});
var console_default = workerdConsole;

// ../../../../usr/lib/node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-console
globalThis.console = console_default;

// ../../../../usr/lib/node_modules/wrangler/node_modules/unenv/dist/runtime/node/internal/process/hrtime.mjs
var hrtime = /* @__PURE__ */ Object.assign(/* @__PURE__ */ __name(function hrtime2(startTime) {
  const now = Date.now();
  const seconds = Math.trunc(now / 1e3);
  const nanos = now % 1e3 * 1e6;
  if (startTime) {
    let diffSeconds = seconds - startTime[0];
    let diffNanos = nanos - startTime[0];
    if (diffNanos < 0) {
      diffSeconds = diffSeconds - 1;
      diffNanos = 1e9 + diffNanos;
    }
    return [diffSeconds, diffNanos];
  }
  return [seconds, nanos];
}, "hrtime"), { bigint: /* @__PURE__ */ __name(function bigint() {
  return BigInt(Date.now() * 1e6);
}, "bigint") });

// ../../../../usr/lib/node_modules/wrangler/node_modules/unenv/dist/runtime/node/internal/process/process.mjs
import { EventEmitter } from "node:events";

// ../../../../usr/lib/node_modules/wrangler/node_modules/unenv/dist/runtime/node/internal/tty/read-stream.mjs
var ReadStream = class {
  static {
    __name(this, "ReadStream");
  }
  fd;
  isRaw = false;
  isTTY = false;
  constructor(fd) {
    this.fd = fd;
  }
  setRawMode(mode) {
    this.isRaw = mode;
    return this;
  }
};

// ../../../../usr/lib/node_modules/wrangler/node_modules/unenv/dist/runtime/node/internal/tty/write-stream.mjs
var WriteStream = class {
  static {
    __name(this, "WriteStream");
  }
  fd;
  columns = 80;
  rows = 24;
  isTTY = false;
  constructor(fd) {
    this.fd = fd;
  }
  clearLine(dir3, callback) {
    callback && callback();
    return false;
  }
  clearScreenDown(callback) {
    callback && callback();
    return false;
  }
  cursorTo(x, y, callback) {
    callback && typeof callback === "function" && callback();
    return false;
  }
  moveCursor(dx, dy, callback) {
    callback && callback();
    return false;
  }
  getColorDepth(env2) {
    return 1;
  }
  hasColors(count3, env2) {
    return false;
  }
  getWindowSize() {
    return [this.columns, this.rows];
  }
  write(str, encoding, cb) {
    if (str instanceof Uint8Array) {
      str = new TextDecoder().decode(str);
    }
    try {
      console.log(str);
    } catch {
    }
    cb && typeof cb === "function" && cb();
    return false;
  }
};

// ../../../../usr/lib/node_modules/wrangler/node_modules/unenv/dist/runtime/node/internal/process/node-version.mjs
var NODE_VERSION = "22.14.0";

// ../../../../usr/lib/node_modules/wrangler/node_modules/unenv/dist/runtime/node/internal/process/process.mjs
var Process = class _Process extends EventEmitter {
  static {
    __name(this, "Process");
  }
  env;
  hrtime;
  nextTick;
  constructor(impl) {
    super();
    this.env = impl.env;
    this.hrtime = impl.hrtime;
    this.nextTick = impl.nextTick;
    for (const prop of [...Object.getOwnPropertyNames(_Process.prototype), ...Object.getOwnPropertyNames(EventEmitter.prototype)]) {
      const value = this[prop];
      if (typeof value === "function") {
        this[prop] = value.bind(this);
      }
    }
  }
  // --- event emitter ---
  emitWarning(warning, type, code) {
    console.warn(`${code ? `[${code}] ` : ""}${type ? `${type}: ` : ""}${warning}`);
  }
  emit(...args) {
    return super.emit(...args);
  }
  listeners(eventName) {
    return super.listeners(eventName);
  }
  // --- stdio (lazy initializers) ---
  #stdin;
  #stdout;
  #stderr;
  get stdin() {
    return this.#stdin ??= new ReadStream(0);
  }
  get stdout() {
    return this.#stdout ??= new WriteStream(1);
  }
  get stderr() {
    return this.#stderr ??= new WriteStream(2);
  }
  // --- cwd ---
  #cwd = "/";
  chdir(cwd2) {
    this.#cwd = cwd2;
  }
  cwd() {
    return this.#cwd;
  }
  // --- dummy props and getters ---
  arch = "";
  platform = "";
  argv = [];
  argv0 = "";
  execArgv = [];
  execPath = "";
  title = "";
  pid = 200;
  ppid = 100;
  get version() {
    return `v${NODE_VERSION}`;
  }
  get versions() {
    return { node: NODE_VERSION };
  }
  get allowedNodeEnvironmentFlags() {
    return /* @__PURE__ */ new Set();
  }
  get sourceMapsEnabled() {
    return false;
  }
  get debugPort() {
    return 0;
  }
  get throwDeprecation() {
    return false;
  }
  get traceDeprecation() {
    return false;
  }
  get features() {
    return {};
  }
  get release() {
    return {};
  }
  get connected() {
    return false;
  }
  get config() {
    return {};
  }
  get moduleLoadList() {
    return [];
  }
  constrainedMemory() {
    return 0;
  }
  availableMemory() {
    return 0;
  }
  uptime() {
    return 0;
  }
  resourceUsage() {
    return {};
  }
  // --- noop methods ---
  ref() {
  }
  unref() {
  }
  // --- unimplemented methods ---
  umask() {
    throw createNotImplementedError("process.umask");
  }
  getBuiltinModule() {
    return void 0;
  }
  getActiveResourcesInfo() {
    throw createNotImplementedError("process.getActiveResourcesInfo");
  }
  exit() {
    throw createNotImplementedError("process.exit");
  }
  reallyExit() {
    throw createNotImplementedError("process.reallyExit");
  }
  kill() {
    throw createNotImplementedError("process.kill");
  }
  abort() {
    throw createNotImplementedError("process.abort");
  }
  dlopen() {
    throw createNotImplementedError("process.dlopen");
  }
  setSourceMapsEnabled() {
    throw createNotImplementedError("process.setSourceMapsEnabled");
  }
  loadEnvFile() {
    throw createNotImplementedError("process.loadEnvFile");
  }
  disconnect() {
    throw createNotImplementedError("process.disconnect");
  }
  cpuUsage() {
    throw createNotImplementedError("process.cpuUsage");
  }
  setUncaughtExceptionCaptureCallback() {
    throw createNotImplementedError("process.setUncaughtExceptionCaptureCallback");
  }
  hasUncaughtExceptionCaptureCallback() {
    throw createNotImplementedError("process.hasUncaughtExceptionCaptureCallback");
  }
  initgroups() {
    throw createNotImplementedError("process.initgroups");
  }
  openStdin() {
    throw createNotImplementedError("process.openStdin");
  }
  assert() {
    throw createNotImplementedError("process.assert");
  }
  binding() {
    throw createNotImplementedError("process.binding");
  }
  // --- attached interfaces ---
  permission = { has: /* @__PURE__ */ notImplemented("process.permission.has") };
  report = {
    directory: "",
    filename: "",
    signal: "SIGUSR2",
    compact: false,
    reportOnFatalError: false,
    reportOnSignal: false,
    reportOnUncaughtException: false,
    getReport: /* @__PURE__ */ notImplemented("process.report.getReport"),
    writeReport: /* @__PURE__ */ notImplemented("process.report.writeReport")
  };
  finalization = {
    register: /* @__PURE__ */ notImplemented("process.finalization.register"),
    unregister: /* @__PURE__ */ notImplemented("process.finalization.unregister"),
    registerBeforeExit: /* @__PURE__ */ notImplemented("process.finalization.registerBeforeExit")
  };
  memoryUsage = Object.assign(() => ({
    arrayBuffers: 0,
    rss: 0,
    external: 0,
    heapTotal: 0,
    heapUsed: 0
  }), { rss: /* @__PURE__ */ __name(() => 0, "rss") });
  // --- undefined props ---
  mainModule = void 0;
  domain = void 0;
  // optional
  send = void 0;
  exitCode = void 0;
  channel = void 0;
  getegid = void 0;
  geteuid = void 0;
  getgid = void 0;
  getgroups = void 0;
  getuid = void 0;
  setegid = void 0;
  seteuid = void 0;
  setgid = void 0;
  setgroups = void 0;
  setuid = void 0;
  // internals
  _events = void 0;
  _eventsCount = void 0;
  _exiting = void 0;
  _maxListeners = void 0;
  _debugEnd = void 0;
  _debugProcess = void 0;
  _fatalException = void 0;
  _getActiveHandles = void 0;
  _getActiveRequests = void 0;
  _kill = void 0;
  _preload_modules = void 0;
  _rawDebug = void 0;
  _startProfilerIdleNotifier = void 0;
  _stopProfilerIdleNotifier = void 0;
  _tickCallback = void 0;
  _disconnect = void 0;
  _handleQueue = void 0;
  _pendingMessage = void 0;
  _channel = void 0;
  _send = void 0;
  _linkedBinding = void 0;
};

// ../../../../usr/lib/node_modules/wrangler/node_modules/@cloudflare/unenv-preset/dist/runtime/node/process.mjs
var globalProcess = globalThis["process"];
var getBuiltinModule = globalProcess.getBuiltinModule;
var workerdProcess = getBuiltinModule("node:process");
var unenvProcess = new Process({
  env: globalProcess.env,
  hrtime,
  // `nextTick` is available from workerd process v1
  nextTick: workerdProcess.nextTick
});
var { exit, features, platform } = workerdProcess;
var {
  _channel,
  _debugEnd,
  _debugProcess,
  _disconnect,
  _events,
  _eventsCount,
  _exiting,
  _fatalException,
  _getActiveHandles,
  _getActiveRequests,
  _handleQueue,
  _kill,
  _linkedBinding,
  _maxListeners,
  _pendingMessage,
  _preload_modules,
  _rawDebug,
  _send,
  _startProfilerIdleNotifier,
  _stopProfilerIdleNotifier,
  _tickCallback,
  abort,
  addListener,
  allowedNodeEnvironmentFlags,
  arch,
  argv,
  argv0,
  assert: assert2,
  availableMemory,
  binding,
  channel,
  chdir,
  config,
  connected,
  constrainedMemory,
  cpuUsage,
  cwd,
  debugPort,
  disconnect,
  dlopen,
  domain,
  emit,
  emitWarning,
  env,
  eventNames,
  execArgv,
  execPath,
  exitCode,
  finalization,
  getActiveResourcesInfo,
  getegid,
  geteuid,
  getgid,
  getgroups,
  getMaxListeners,
  getuid,
  hasUncaughtExceptionCaptureCallback,
  hrtime: hrtime3,
  initgroups,
  kill,
  listenerCount,
  listeners,
  loadEnvFile,
  mainModule,
  memoryUsage,
  moduleLoadList,
  nextTick,
  off,
  on,
  once,
  openStdin,
  permission,
  pid,
  ppid,
  prependListener,
  prependOnceListener,
  rawListeners,
  reallyExit,
  ref,
  release,
  removeAllListeners,
  removeListener,
  report,
  resourceUsage,
  send,
  setegid,
  seteuid,
  setgid,
  setgroups,
  setMaxListeners,
  setSourceMapsEnabled,
  setuid,
  setUncaughtExceptionCaptureCallback,
  sourceMapsEnabled,
  stderr,
  stdin,
  stdout,
  throwDeprecation,
  title,
  traceDeprecation,
  umask,
  unref,
  uptime,
  version,
  versions
} = unenvProcess;
var _process = {
  abort,
  addListener,
  allowedNodeEnvironmentFlags,
  hasUncaughtExceptionCaptureCallback,
  setUncaughtExceptionCaptureCallback,
  loadEnvFile,
  sourceMapsEnabled,
  arch,
  argv,
  argv0,
  chdir,
  config,
  connected,
  constrainedMemory,
  availableMemory,
  cpuUsage,
  cwd,
  debugPort,
  dlopen,
  disconnect,
  emit,
  emitWarning,
  env,
  eventNames,
  execArgv,
  execPath,
  exit,
  finalization,
  features,
  getBuiltinModule,
  getActiveResourcesInfo,
  getMaxListeners,
  hrtime: hrtime3,
  kill,
  listeners,
  listenerCount,
  memoryUsage,
  nextTick,
  on,
  off,
  once,
  pid,
  platform,
  ppid,
  prependListener,
  prependOnceListener,
  rawListeners,
  release,
  removeAllListeners,
  removeListener,
  report,
  resourceUsage,
  setMaxListeners,
  setSourceMapsEnabled,
  stderr,
  stdin,
  stdout,
  title,
  throwDeprecation,
  traceDeprecation,
  umask,
  uptime,
  version,
  versions,
  // @ts-expect-error old API
  domain,
  initgroups,
  moduleLoadList,
  reallyExit,
  openStdin,
  assert: assert2,
  binding,
  send,
  exitCode,
  channel,
  getegid,
  geteuid,
  getgid,
  getgroups,
  getuid,
  setegid,
  seteuid,
  setgid,
  setgroups,
  setuid,
  permission,
  mainModule,
  _events,
  _eventsCount,
  _exiting,
  _maxListeners,
  _debugEnd,
  _debugProcess,
  _fatalException,
  _getActiveHandles,
  _getActiveRequests,
  _kill,
  _preload_modules,
  _rawDebug,
  _startProfilerIdleNotifier,
  _stopProfilerIdleNotifier,
  _tickCallback,
  _disconnect,
  _handleQueue,
  _pendingMessage,
  _channel,
  _send,
  _linkedBinding
};
var process_default = _process;

// ../../../../usr/lib/node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-process
globalThis.process = process_default;

// api/admin/_auth.js
var SESSION_COOKIE = "ns_admin_session";
var SESSION_SECONDS = 86400;
function hex(bytes) {
  return [...new Uint8Array(bytes)].map((b) => b.toString(16).padStart(2, "0")).join("");
}
__name(hex, "hex");
async function sha256(text) {
  return hex(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text)));
}
__name(sha256, "sha256");
function parseCookies(request) {
  const raw = request.headers.get("Cookie") || "";
  return Object.fromEntries(raw.split(";").map((x) => x.trim()).filter(Boolean).map((x) => {
    const i = x.indexOf("=");
    return i < 0 ? [x, ""] : [x.slice(0, i), decodeURIComponent(x.slice(i + 1))];
  }));
}
__name(parseCookies, "parseCookies");
function json(data, status = 200, extra = {}) {
  return new Response(JSON.stringify(data), { status, headers: { "content-type": "application/json", ...extra } });
}
__name(json, "json");
async function requireAdmin(request, env2) {
  if (!env2.DB) return { response: json({ error: "Database is not configured." }, 503) };
  const token = parseCookies(request)[SESSION_COOKIE];
  if (!token) return { response: json({ error: "Unauthorized." }, 401) };
  const tokenHash = await sha256(token);
  const row = await env2.DB.prepare("SELECT id, expires_at FROM admin_sessions WHERE token_hash = ?").bind(tokenHash).first();
  if (!row || Number(row.expires_at) <= Math.floor(Date.now() / 1e3)) {
    if (row) await env2.DB.prepare("DELETE FROM admin_sessions WHERE id = ?").bind(row.id).run();
    return { response: json({ error: "Unauthorized." }, 401) };
  }
  return { ok: true, sessionId: row.id };
}
__name(requireAdmin, "requireAdmin");
async function createSession(env2) {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  const token = btoa(String.fromCharCode(...bytes)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  const tokenHash = await sha256(token);
  const id = crypto.randomUUID();
  const expiresAt = Math.floor(Date.now() / 1e3) + SESSION_SECONDS;
  await env2.DB.prepare("INSERT INTO admin_sessions (id, token_hash, expires_at, created_at) VALUES (?,?,?,?)").bind(id, tokenHash, expiresAt, Math.floor(Date.now() / 1e3)).run();
  return { token, expiresAt };
}
__name(createSession, "createSession");
function sessionCookie(token, maxAge = SESSION_SECONDS) {
  return `${SESSION_COOKIE}=${encodeURIComponent(token)}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${maxAge}`;
}
__name(sessionCookie, "sessionCookie");
function clearSessionCookie() {
  return `${SESSION_COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0`;
}
__name(clearSessionCookie, "clearSessionCookie");
async function verifyPassword(password, expected) {
  if (!expected || !password) return false;
  const a = new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(password)));
  const b = new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(expected)));
  return crypto.subtle.timingSafeEqual(a, b);
}
__name(verifyPassword, "verifyPassword");

// api/admin/ceeprinto.js
async function onRequestPost({ request, env: env2 }) {
  const auth = await requireAdmin(request, env2);
  if (!auth.ok) return auth.response;
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid JSON." }, 400);
  }
  if (!body.action) {
    return json({ error: "Missing action." }, 400);
  }
  const response = await fetch(new URL("/api/ceeprinto", request.url), {
    method: "POST",
    headers: {
      "content-type": "application/json",
      cookie: request.headers.get("cookie") || ""
    },
    body: JSON.stringify(body)
  });
  const text = await response.text();
  return new Response(text, {
    status: response.status,
    headers: {
      "content-type": "application/json"
    }
  });
}
__name(onRequestPost, "onRequestPost");

// api/admin/ceeprinto-mappings.js
async function onRequestGet({ request, env: env2 }) {
  const auth = await requireAdmin(request, env2);
  if (!auth.ok) return auth.response;
  const productId = new URL(request.url).searchParams.get("productId");
  if (!productId) {
    return json({ error: "Missing productId." }, 400);
  }
  const { results } = await env2.DB.prepare(`
    SELECT
      id,
      product_id AS productId,
      size,
      color,
      external_variant_id AS externalVariantId,
      listing_id AS listingId,
      external_sku AS externalSku
    FROM ceeprinto_mappings
    WHERE product_id=?
    ORDER BY id ASC
  `).bind(productId).all();
  return json(results);
}
__name(onRequestGet, "onRequestGet");
async function onRequestPost2({ request, env: env2 }) {
  const auth = await requireAdmin(request, env2);
  if (!auth.ok) return auth.response;
  let b;
  try {
    b = await request.json();
  } catch {
    return json({ error: "Invalid JSON." }, 400);
  }
  if (!b.productId || !b.externalVariantId) {
    return json({
      error: "productId and externalVariantId are required."
    }, 400);
  }
  await env2.DB.prepare(`
    INSERT INTO ceeprinto_mappings (
      product_id,
      size,
      color,
      external_variant_id,
      listing_id,
      external_sku,
      updated_at
    )
    VALUES (?,?,?,?,?,?,CURRENT_TIMESTAMP)
    ON CONFLICT(product_id,size,color)
    DO UPDATE SET
      external_variant_id=excluded.external_variant_id,
      listing_id=excluded.listing_id,
      external_sku=excluded.external_sku,
      updated_at=CURRENT_TIMESTAMP
  `).bind(
    b.productId,
    b.size || null,
    b.color || null,
    String(b.externalVariantId),
    b.listingId ? Number(b.listingId) : null,
    b.externalSku || null
  ).run();
  return json({ ok: true });
}
__name(onRequestPost2, "onRequestPost");
async function onRequestDelete({ request, env: env2 }) {
  const auth = await requireAdmin(request, env2);
  if (!auth.ok) return auth.response;
  let b;
  try {
    b = await request.json();
  } catch {
    return json({ error: "Invalid JSON." }, 400);
  }
  if (!b.id) return json({ error: "Missing mapping id." }, 400);
  await env2.DB.prepare(
    "DELETE FROM ceeprinto_mappings WHERE id=?"
  ).bind(b.id).run();
  return json({ ok: true });
}
__name(onRequestDelete, "onRequestDelete");

// api/admin/login.js
async function onRequestPost3({ request, env: env2 }) {
  if (!env2.DB || !env2.ADMIN_PASSWORD) return json({ error: "Admin authentication is not configured yet." }, 503);
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid JSON." }, 400);
  }
  if (!await verifyPassword(String(body.password || ""), env2.ADMIN_PASSWORD)) return json({ error: "Incorrect password." }, 401);
  const session = await createSession(env2);
  return json({ ok: true }, 200, { "Set-Cookie": sessionCookie(session.token) });
}
__name(onRequestPost3, "onRequestPost");

// api/admin/logout.js
async function onRequestPost4({ request, env: env2 }) {
  const auth = await requireAdmin(request, env2);
  if (auth.ok) await env2.DB.prepare("DELETE FROM admin_sessions WHERE id = ?").bind(auth.sessionId).run();
  return json({ ok: true }, 200, { "Set-Cookie": clearSessionCookie() });
}
__name(onRequestPost4, "onRequestPost");

// api/admin/orders.js
async function onRequestGet2({ request, env: env2 }) {
  const auth = await requireAdmin(request, env2);
  if (!auth.ok) return auth.response;
  const { results } = await env2.DB.prepare(`
    SELECT
      o.id,
      o.subtotal,
      o.shipping,
      o.total,
      o.payment_method AS paymentMethod,
      o.payment_status AS paymentStatus,
      o.fulfillment_status AS fulfillmentStatus,
      o.ceeprinto_order_id AS ceeprintoOrderId,
      o.tracking_number AS trackingNumber,
      o.created_at AS createdAt,

      c.name AS customerName,
      c.email,
      c.phone,
      c.city,
      c.address,
      c.postal_code AS postalCode

    FROM orders o
    LEFT JOIN customers c ON c.id=o.customer_id
    ORDER BY o.rowid DESC
  `).all();
  const orders = [];
  for (const o of results) {
    const { results: items } = await env2.DB.prepare(`
      SELECT
        product_id AS productId,
        name,
        size,
        color,
        quantity,
        unit_price AS unitPrice
      FROM order_items
      WHERE order_id=?
      ORDER BY id ASC
    `).bind(o.id).all();
    orders.push({
      ...o,
      status: o.fulfillmentStatus || "received",
      items
    });
  }
  return json(orders);
}
__name(onRequestGet2, "onRequestGet");

// api/admin/products.js
function normalize(p) {
  return {
    ...p,
    sizes: JSON.parse(p.sizes_json || "[]"),
    colors: JSON.parse(p.colors_json || "[]"),
    colorImages: JSON.parse(p.color_images_json || "{}"),
    featured: !!p.featured,
    published: !!p.published
  };
}
__name(normalize, "normalize");
async function onRequestGet3({ request, env: env2 }) {
  const auth = await requireAdmin(request, env2);
  if (!auth.ok) return auth.response;
  const { results } = await env2.DB.prepare(`
    SELECT
      id,
      name,
      slug,
      category,
      price,
      compare_at AS compareAt,
      badge,
      description,
      image,
      sizes_json,
      colors_json,
      color_images_json,
      stock,
      featured,
      published,
      ceeprinto_product_id AS ceeprintoProductId,
      fulfillment_type AS fulfillmentType
    FROM products
    ORDER BY created_at DESC
  `).all();
  return json(results.map(normalize));
}
__name(onRequestGet3, "onRequestGet");
async function onRequestPost5({ request, env: env2 }) {
  const auth = await requireAdmin(request, env2);
  if (!auth.ok) return auth.response;
  let b;
  try {
    b = await request.json();
  } catch {
    return json({ error: "Invalid JSON." }, 400);
  }
  const id = b.id || `NS-${Date.now().toString(36).toUpperCase()}`;
  const slug = b.slug || String(b.name || id).toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const sizes = Array.isArray(b.sizes) && b.sizes.length ? b.sizes : ["S", "M", "L", "XL"];
  const colors = Array.isArray(b.colors) && b.colors.length ? b.colors : ["BLACK"];
  const colorImages = b.colorImages && typeof b.colorImages === "object" ? b.colorImages : {};
  await env2.DB.prepare(`
    INSERT INTO products (
      id,
      name,
      slug,
      category,
      price,
      compare_at,
      badge,
      description,
      image,
      sizes_json,
      colors_json,
      color_images_json,
      stock,
      featured,
      published,
      ceeprinto_product_id,
      fulfillment_type,
      created_at
    )
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
  `).bind(
    id,
    b.name,
    slug,
    String(b.category || "ACCESSORIES").toUpperCase(),
    Number(b.price || 0),
    b.compareAt ? Number(b.compareAt) : null,
    b.badge || "NEW",
    b.description || "",
    b.image || "assets/no-signal-logo.png",
    JSON.stringify(sizes),
    JSON.stringify(colors),
    JSON.stringify(colorImages),
    Number(b.stock || 0),
    b.featured ? 1 : 0,
    b.published === false ? 0 : 1,
    b.ceeprintoProductId || null,
    b.fulfillmentType === "ceeprinto" ? "ceeprinto" : "internal",
    (/* @__PURE__ */ new Date()).toISOString()
  ).run();
  return json({ ok: true, id }, 201);
}
__name(onRequestPost5, "onRequestPost");
async function onRequestDelete2({ request, env: env2 }) {
  const auth = await requireAdmin(request, env2);
  if (!auth.ok) return auth.response;
  let b;
  try {
    b = await request.json();
  } catch {
    return json({ error: "Invalid JSON." }, 400);
  }
  if (!b.id) return json({ error: "Missing product id." }, 400);
  await env2.DB.prepare("DELETE FROM products WHERE id=?").bind(b.id).run();
  return json({ ok: true });
}
__name(onRequestDelete2, "onRequestDelete");

// api/admin/session.js
async function onRequestGet4({ request, env: env2 }) {
  const auth = await requireAdmin(request, env2);
  return auth.ok ? json({ ok: true }) : auth.response;
}
__name(onRequestGet4, "onRequestGet");

// api/admin/settings.js
var defaults = { brand: "NO SIGNAL", subbrand: "APPAREL CO.", tagline: "WEAR THE UNKNOWN", currency: "PKR", country: "Pakistan", email: "nosignal.apparelco@gmail.com", phone: "", instagram: "", tiktok: "", facebook: "", youtube: "", address: "", businessHours: "", whatsapp: "", shippingFee: 250, freeShippingAbove: 5e3, cod: true, onlinePayments: true };
async function read(env2) {
  const { results } = await env2.DB.prepare("SELECT key,value FROM store_settings").all();
  const s = { ...defaults };
  for (const r of results) {
    try {
      s[r.key] = JSON.parse(r.value);
    } catch {
      s[r.key] = r.value;
    }
  }
  return s;
}
__name(read, "read");
async function onRequestGet5({ request, env: env2 }) {
  const a = await requireAdmin(request, env2);
  if (!a.ok) return a.response;
  return json(await read(env2));
}
__name(onRequestGet5, "onRequestGet");
async function onRequestPut({ request, env: env2 }) {
  const a = await requireAdmin(request, env2);
  if (!a.ok) return a.response;
  let b;
  try {
    b = await request.json();
  } catch {
    return json({ error: "Invalid JSON." }, 400);
  }
  ;
  const now = Date.now();
  for (const [k, v] of Object.entries({ ...defaults, ...b })) await env2.DB.prepare("INSERT INTO store_settings(key,value,updated_at) VALUES(?,?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value,updated_at=excluded.updated_at").bind(k, JSON.stringify(v), now).run();
  return json({ ok: true, settings: await read(env2) });
}
__name(onRequestPut, "onRequestPut");

// api/ceeprinto.js
var DEFAULT_BASE = "https://ceeprinto.com/wp-json/ceeprinto/v2";
function json2(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json" }
  });
}
__name(json2, "json");
function base(env2) {
  return String(env2.CEEPRINTO_API_BASE_URL || DEFAULT_BASE).replace(/\/+$/, "");
}
__name(base, "base");
function key(env2) {
  return env2.CEEPRINTO_API_TOKEN;
}
__name(key, "key");
async function cpFetch(env2, path, options = {}) {
  if (!key(env2)) {
    return {
      ok: false,
      status: 503,
      body: {
        error: {
          code: "not_configured",
          message: "CEEPRINTO_API_TOKEN is not configured."
        }
      }
    };
  }
  const headers = {
    Authorization: `Bearer ${key(env2)}`,
    "Content-Type": "application/json",
    "X-CP-Api-Version": "2.2.0",
    ...options.headers || {}
  };
  const response = await fetch(`${base(env2)}${path}`, {
    ...options,
    headers
  });
  let body = null;
  try {
    body = await response.json();
  } catch {
    body = { error: { code: "invalid_response", message: "CeePrinto returned a non-JSON response." } };
  }
  return {
    ok: response.ok,
    status: response.status,
    body
  };
}
__name(cpFetch, "cpFetch");
async function getSetting(env2, name) {
  const row = await env2.DB.prepare("SELECT value FROM settings WHERE key=?").bind(name).first();
  return row?.value || null;
}
__name(getSetting, "getSetting");
async function setSetting(env2, name, value) {
  await env2.DB.prepare(`
      INSERT INTO settings (key,value)
      VALUES (?,?)
      ON CONFLICT(key) DO UPDATE SET value=excluded.value
    `).bind(name, String(value)).run();
}
__name(setSetting, "setSetting");
async function ensureShop(env2) {
  let shopId = await getSetting(env2, "ceeprinto_shop_id");
  if (shopId) return Number(shopId);
  const externalShopId = await getSetting(env2, "ceeprinto_external_shop_id") || "no-signal-store";
  const response = await cpFetch(env2, "/shops", {
    method: "POST",
    body: JSON.stringify({
      channel: "custom",
      external_shop_id: externalShopId,
      name: "NO SIGNAL"
    })
  });
  if (!response.ok) {
    throw new Error(
      response.body?.error?.message || `CeePrinto shop registration failed (${response.status}).`
    );
  }
  shopId = response.body?.data?.id;
  if (!shopId) {
    throw new Error("CeePrinto did not return a shop ID.");
  }
  await setSetting(env2, "ceeprinto_shop_id", shopId);
  return Number(shopId);
}
__name(ensureShop, "ensureShop");
async function submitOrder(env2, orderId) {
  const shopId = await ensureShop(env2);
  const order = await env2.DB.prepare(`
    SELECT
      o.id,
      o.subtotal,
      o.shipping,
      o.total,
      o.payment_method,
      c.name,
      c.email,
      c.phone,
      c.city,
      c.address,
      c.postal_code
    FROM orders o
    JOIN customers c ON c.id=o.customer_id
    WHERE o.id=?
  `).bind(orderId).first();
  if (!order) throw new Error("NO SIGNAL order was not found.");
  const { results: items } = await env2.DB.prepare(`
    SELECT
      oi.product_id,
      oi.name,
      oi.size,
      oi.color,
      oi.quantity,
      oi.unit_price,
      p.fulfillment_type,
      cm.external_variant_id,
      cm.listing_id,
      cm.external_sku
    FROM order_items oi
    LEFT JOIN products p ON p.id=oi.product_id
    LEFT JOIN ceeprinto_mappings cm
      ON cm.product_id=oi.product_id
      AND COALESCE(cm.size,'')=COALESCE(oi.size,'')
      AND COALESCE(cm.color,'')=COALESCE(oi.color,'')
    WHERE oi.order_id=?
    ORDER BY oi.id ASC
  `).bind(orderId).all();
  const ceeItems = items.filter(
    (item) => String(item.fulfillment_type || "internal").toLowerCase() === "ceeprinto"
  );
  if (!ceeItems.length) {
    throw new Error("This order contains no CeePrinto products.");
  }
  const lineItems = [];
  for (const item of ceeItems) {
    const reference = {};
    if (item.listing_id) {
      reference.listing_id = Number(item.listing_id);
    } else if (item.external_variant_id) {
      reference.external_variant_id = item.external_variant_id;
    } else if (item.external_sku) {
      reference.external_sku = item.external_sku;
    } else {
      throw new Error(
        `No CeePrinto mapping exists for ${item.name}${item.size ? ` / ${item.size}` : ""}${item.color ? ` / ${item.color}` : ""}.`
      );
    }
    lineItems.push({
      ...reference,
      quantity: Number(item.quantity),
      customer_price: Number(item.unit_price)
    });
  }
  const idempotencyKey = `no-signal-${orderId}`;
  const response = await cpFetch(env2, "/orders", {
    method: "POST",
    headers: {
      "Idempotency-Key": idempotencyKey
    },
    body: JSON.stringify({
      shop_id: shopId,
      shipping_address: {
        name: order.name,
        email: order.email || void 0,
        phone: order.phone,
        city: order.city || "",
        address: order.address,
        postal_code: order.postal_code || ""
      },
      line_items: lineItems
    })
  });
  if (!response.ok) {
    throw new Error(
      response.body?.error?.message || `CeePrinto order submission failed (${response.status}).`
    );
  }
  const cpOrder = response.body?.data || response.body;
  const cpId = cpOrder?.id || cpOrder?.order_id || cpOrder?.order?.id;
  await env2.DB.prepare(`
    UPDATE orders
    SET
      ceeprinto_order_id=?,
      fulfillment_status='submitted'
    WHERE id=?
  `).bind(
    cpId ? String(cpId) : null,
    orderId
  ).run();
  return {
    shopId,
    ceeprintoOrderId: cpId || null,
    response: cpOrder
  };
}
__name(submitOrder, "submitOrder");
async function onRequestPost6({ request, env: env2 }) {
  if (!env2.DB) return json2({ error: "Database is not configured." }, 503);
  let body;
  try {
    body = await request.json();
  } catch {
    return json2({ error: "Invalid JSON." }, 400);
  }
  const action = body.action || "status";
  try {
    if (action === "status") {
      if (!key(env2)) {
        return json2({
          ok: false,
          configured: false
        });
      }
      const me = await cpFetch(env2, "/me");
      return json2({
        ok: me.ok,
        configured: true,
        status: me.status,
        data: me.body
      }, me.ok ? 200 : me.status);
    }
    if (action === "connect") {
      const shopId = await ensureShop(env2);
      return json2({
        ok: true,
        shopId
      });
    }
    if (action === "listings") {
      const shopId = await ensureShop(env2);
      const page = Number(body.page || 1);
      const perPage = Math.min(Number(body.perPage || 100), 100);
      const result = await cpFetch(
        env2,
        `/shops/${shopId}/listings?page=${page}&per_page=${perPage}`
      );
      return json2({
        ok: result.ok,
        shopId,
        data: result.body
      }, result.status);
    }
    if (action === "send-order") {
      if (!body.orderId) {
        return json2({ error: "Missing orderId." }, 400);
      }
      const result = await submitOrder(env2, body.orderId);
      return json2({
        ok: true,
        ...result
      }, 202);
    }
    if (action === "get-order") {
      if (!body.orderId) {
        return json2({ error: "Missing CeePrinto order ID." }, 400);
      }
      const result = await cpFetch(
        env2,
        `/orders/${encodeURIComponent(body.orderId)}`
      );
      return json2({
        ok: result.ok,
        data: result.body
      }, result.status);
    }
    return json2({ error: "Unknown CeePrinto action." }, 400);
  } catch (error3) {
    return json2({
      ok: false,
      error: error3.message || "CeePrinto request failed."
    }, 500);
  }
}
__name(onRequestPost6, "onRequestPost");

// api/health.js
async function onRequestGet6() {
  return Response.json({ ok: true, service: "NO SIGNAL API", version: "1.0" });
}
__name(onRequestGet6, "onRequestGet");

// api/orders.js
function json3(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { "content-type": "application/json" } });
}
__name(json3, "json");
async function onRequestPost7({ request, env: env2 }) {
  if (!env2.DB) return json3({ error: "Database is not configured yet." }, 503);
  let body;
  try {
    body = await request.json();
  } catch {
    return json3({ error: "Invalid JSON." }, 400);
  }
  for (const key2 of ["customer", "items", "paymentMethod"]) if (!body[key2]) return json3({ error: `Missing ${key2}.` }, 400);
  if (!Array.isArray(body.items) || !body.items.length) return json3({ error: "Cart is empty." }, 400);
  const id = `NS-${Date.now().toString(36).toUpperCase()}`, c = body.customer, customerId = crypto.randomUUID();
  const subtotal = body.items.reduce((s, i) => s + Number(i.unitPrice || 0) * Number(i.quantity || 0), 0), shipping = Number(body.shipping || 0), total = subtotal + shipping;
  await env2.DB.prepare(`INSERT INTO customers (id,name,email,phone,city,address,postal_code) VALUES (?,?,?,?,?,?,?)`).bind(customerId, c.name, c.email || null, c.phone, c.city || null, c.address, c.postalCode || null).run();
  await env2.DB.prepare(`INSERT INTO orders (id,customer_id,subtotal,shipping,total,payment_method) VALUES (?,?,?,?,?,?)`).bind(id, customerId, subtotal, shipping, total, body.paymentMethod).run();
  for (const i of body.items) await env2.DB.prepare(`INSERT INTO order_items (order_id,product_id,name,size,color,quantity,unit_price) VALUES (?,?,?,?,?,?,?)`).bind(id, i.productId, i.name, i.size || null, i.color || null, Number(i.quantity), Number(i.unitPrice)).run();
  return json3({ ok: true, orderId: id, status: "received" }, 201);
}
__name(onRequestPost7, "onRequestPost");

// api/products.js
async function onRequestGet7({ env: env2 }) {
  if (!env2.DB) {
    return Response.json(
      { error: "Database is not configured yet." },
      { status: 503 }
    );
  }
  const { results } = await env2.DB.prepare(`
    SELECT
      id,
      name,
      slug,
      category,
      price,
      compare_at AS compareAt,
      badge,
      description,
      image,
      sizes_json,
      colors_json,
      color_images_json,
      stock,
      featured,
      published,
      ceeprinto_product_id AS ceeprintoProductId,
      fulfillment_type AS fulfillmentType
    FROM products
    WHERE published=1
    ORDER BY created_at DESC
  `).all();
  return Response.json(
    results.map((p) => ({
      ...p,
      sizes: JSON.parse(p.sizes_json || "[]"),
      colors: JSON.parse(p.colors_json || "[]"),
      colorImages: JSON.parse(p.color_images_json || "{}")
    }))
  );
}
__name(onRequestGet7, "onRequestGet");

// api/settings.js
async function onRequestGet8({ env: env2 }) {
  const defaults2 = { brand: "NO SIGNAL", subbrand: "APPAREL CO.", tagline: "WEAR THE UNKNOWN", currency: "PKR", country: "Pakistan", email: "nosignal.apparelco@gmail.com", phone: "", instagram: "", tiktok: "", facebook: "", youtube: "", address: "", businessHours: "", whatsapp: "", shippingFee: 250, freeShippingAbove: 5e3, cod: true, onlinePayments: true };
  if (!env2.DB) return Response.json(defaults2);
  const { results } = await env2.DB.prepare("SELECT key,value FROM store_settings").all();
  const s = { ...defaults2 };
  for (const r of results) {
    try {
      s[r.key] = JSON.parse(r.value);
    } catch {
      s[r.key] = r.value;
    }
  }
  return Response.json(s);
}
__name(onRequestGet8, "onRequestGet");

// ../.wrangler/tmp/pages-K4k8T5/functionsRoutes-0.9947167092262441.mjs
var routes = [
  {
    routePath: "/api/admin/ceeprinto",
    mountPath: "/api/admin",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost]
  },
  {
    routePath: "/api/admin/ceeprinto-mappings",
    mountPath: "/api/admin",
    method: "DELETE",
    middlewares: [],
    modules: [onRequestDelete]
  },
  {
    routePath: "/api/admin/ceeprinto-mappings",
    mountPath: "/api/admin",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet]
  },
  {
    routePath: "/api/admin/ceeprinto-mappings",
    mountPath: "/api/admin",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost2]
  },
  {
    routePath: "/api/admin/login",
    mountPath: "/api/admin",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost3]
  },
  {
    routePath: "/api/admin/logout",
    mountPath: "/api/admin",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost4]
  },
  {
    routePath: "/api/admin/orders",
    mountPath: "/api/admin",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet2]
  },
  {
    routePath: "/api/admin/products",
    mountPath: "/api/admin",
    method: "DELETE",
    middlewares: [],
    modules: [onRequestDelete2]
  },
  {
    routePath: "/api/admin/products",
    mountPath: "/api/admin",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet3]
  },
  {
    routePath: "/api/admin/products",
    mountPath: "/api/admin",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost5]
  },
  {
    routePath: "/api/admin/session",
    mountPath: "/api/admin",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet4]
  },
  {
    routePath: "/api/admin/settings",
    mountPath: "/api/admin",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet5]
  },
  {
    routePath: "/api/admin/settings",
    mountPath: "/api/admin",
    method: "PUT",
    middlewares: [],
    modules: [onRequestPut]
  },
  {
    routePath: "/api/ceeprinto",
    mountPath: "/api",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost6]
  },
  {
    routePath: "/api/health",
    mountPath: "/api",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet6]
  },
  {
    routePath: "/api/orders",
    mountPath: "/api",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost7]
  },
  {
    routePath: "/api/products",
    mountPath: "/api",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet7]
  },
  {
    routePath: "/api/settings",
    mountPath: "/api",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet8]
  }
];

// ../../../../usr/lib/node_modules/wrangler/node_modules/path-to-regexp/dist.es2015/index.js
function lexer(str) {
  var tokens = [];
  var i = 0;
  while (i < str.length) {
    var char = str[i];
    if (char === "*" || char === "+" || char === "?") {
      tokens.push({ type: "MODIFIER", index: i, value: str[i++] });
      continue;
    }
    if (char === "\\") {
      tokens.push({ type: "ESCAPED_CHAR", index: i++, value: str[i++] });
      continue;
    }
    if (char === "{") {
      tokens.push({ type: "OPEN", index: i, value: str[i++] });
      continue;
    }
    if (char === "}") {
      tokens.push({ type: "CLOSE", index: i, value: str[i++] });
      continue;
    }
    if (char === ":") {
      var name = "";
      var j = i + 1;
      while (j < str.length) {
        var code = str.charCodeAt(j);
        if (
          // `0-9`
          code >= 48 && code <= 57 || // `A-Z`
          code >= 65 && code <= 90 || // `a-z`
          code >= 97 && code <= 122 || // `_`
          code === 95
        ) {
          name += str[j++];
          continue;
        }
        break;
      }
      if (!name)
        throw new TypeError("Missing parameter name at ".concat(i));
      tokens.push({ type: "NAME", index: i, value: name });
      i = j;
      continue;
    }
    if (char === "(") {
      var count3 = 1;
      var pattern = "";
      var j = i + 1;
      if (str[j] === "?") {
        throw new TypeError('Pattern cannot start with "?" at '.concat(j));
      }
      while (j < str.length) {
        if (str[j] === "\\") {
          pattern += str[j++] + str[j++];
          continue;
        }
        if (str[j] === ")") {
          count3--;
          if (count3 === 0) {
            j++;
            break;
          }
        } else if (str[j] === "(") {
          count3++;
          if (str[j + 1] !== "?") {
            throw new TypeError("Capturing groups are not allowed at ".concat(j));
          }
        }
        pattern += str[j++];
      }
      if (count3)
        throw new TypeError("Unbalanced pattern at ".concat(i));
      if (!pattern)
        throw new TypeError("Missing pattern at ".concat(i));
      tokens.push({ type: "PATTERN", index: i, value: pattern });
      i = j;
      continue;
    }
    tokens.push({ type: "CHAR", index: i, value: str[i++] });
  }
  tokens.push({ type: "END", index: i, value: "" });
  return tokens;
}
__name(lexer, "lexer");
function parse(str, options) {
  if (options === void 0) {
    options = {};
  }
  var tokens = lexer(str);
  var _a = options.prefixes, prefixes = _a === void 0 ? "./" : _a, _b = options.delimiter, delimiter = _b === void 0 ? "/#?" : _b;
  var result = [];
  var key2 = 0;
  var i = 0;
  var path = "";
  var tryConsume = /* @__PURE__ */ __name(function(type) {
    if (i < tokens.length && tokens[i].type === type)
      return tokens[i++].value;
  }, "tryConsume");
  var mustConsume = /* @__PURE__ */ __name(function(type) {
    var value2 = tryConsume(type);
    if (value2 !== void 0)
      return value2;
    var _a2 = tokens[i], nextType = _a2.type, index = _a2.index;
    throw new TypeError("Unexpected ".concat(nextType, " at ").concat(index, ", expected ").concat(type));
  }, "mustConsume");
  var consumeText = /* @__PURE__ */ __name(function() {
    var result2 = "";
    var value2;
    while (value2 = tryConsume("CHAR") || tryConsume("ESCAPED_CHAR")) {
      result2 += value2;
    }
    return result2;
  }, "consumeText");
  var isSafe = /* @__PURE__ */ __name(function(value2) {
    for (var _i = 0, delimiter_1 = delimiter; _i < delimiter_1.length; _i++) {
      var char2 = delimiter_1[_i];
      if (value2.indexOf(char2) > -1)
        return true;
    }
    return false;
  }, "isSafe");
  var safePattern = /* @__PURE__ */ __name(function(prefix2) {
    var prev = result[result.length - 1];
    var prevText = prefix2 || (prev && typeof prev === "string" ? prev : "");
    if (prev && !prevText) {
      throw new TypeError('Must have text between two parameters, missing text after "'.concat(prev.name, '"'));
    }
    if (!prevText || isSafe(prevText))
      return "[^".concat(escapeString(delimiter), "]+?");
    return "(?:(?!".concat(escapeString(prevText), ")[^").concat(escapeString(delimiter), "])+?");
  }, "safePattern");
  while (i < tokens.length) {
    var char = tryConsume("CHAR");
    var name = tryConsume("NAME");
    var pattern = tryConsume("PATTERN");
    if (name || pattern) {
      var prefix = char || "";
      if (prefixes.indexOf(prefix) === -1) {
        path += prefix;
        prefix = "";
      }
      if (path) {
        result.push(path);
        path = "";
      }
      result.push({
        name: name || key2++,
        prefix,
        suffix: "",
        pattern: pattern || safePattern(prefix),
        modifier: tryConsume("MODIFIER") || ""
      });
      continue;
    }
    var value = char || tryConsume("ESCAPED_CHAR");
    if (value) {
      path += value;
      continue;
    }
    if (path) {
      result.push(path);
      path = "";
    }
    var open = tryConsume("OPEN");
    if (open) {
      var prefix = consumeText();
      var name_1 = tryConsume("NAME") || "";
      var pattern_1 = tryConsume("PATTERN") || "";
      var suffix = consumeText();
      mustConsume("CLOSE");
      result.push({
        name: name_1 || (pattern_1 ? key2++ : ""),
        pattern: name_1 && !pattern_1 ? safePattern(prefix) : pattern_1,
        prefix,
        suffix,
        modifier: tryConsume("MODIFIER") || ""
      });
      continue;
    }
    mustConsume("END");
  }
  return result;
}
__name(parse, "parse");
function match(str, options) {
  var keys = [];
  var re = pathToRegexp(str, keys, options);
  return regexpToFunction(re, keys, options);
}
__name(match, "match");
function regexpToFunction(re, keys, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.decode, decode = _a === void 0 ? function(x) {
    return x;
  } : _a;
  return function(pathname) {
    var m = re.exec(pathname);
    if (!m)
      return false;
    var path = m[0], index = m.index;
    var params = /* @__PURE__ */ Object.create(null);
    var _loop_1 = /* @__PURE__ */ __name(function(i2) {
      if (m[i2] === void 0)
        return "continue";
      var key2 = keys[i2 - 1];
      if (key2.modifier === "*" || key2.modifier === "+") {
        params[key2.name] = m[i2].split(key2.prefix + key2.suffix).map(function(value) {
          return decode(value, key2);
        });
      } else {
        params[key2.name] = decode(m[i2], key2);
      }
    }, "_loop_1");
    for (var i = 1; i < m.length; i++) {
      _loop_1(i);
    }
    return { path, index, params };
  };
}
__name(regexpToFunction, "regexpToFunction");
function escapeString(str) {
  return str.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");
}
__name(escapeString, "escapeString");
function flags(options) {
  return options && options.sensitive ? "" : "i";
}
__name(flags, "flags");
function regexpToRegexp(path, keys) {
  if (!keys)
    return path;
  var groupsRegex = /\((?:\?<(.*?)>)?(?!\?)/g;
  var index = 0;
  var execResult = groupsRegex.exec(path.source);
  while (execResult) {
    keys.push({
      // Use parenthesized substring match if available, index otherwise
      name: execResult[1] || index++,
      prefix: "",
      suffix: "",
      modifier: "",
      pattern: ""
    });
    execResult = groupsRegex.exec(path.source);
  }
  return path;
}
__name(regexpToRegexp, "regexpToRegexp");
function arrayToRegexp(paths, keys, options) {
  var parts = paths.map(function(path) {
    return pathToRegexp(path, keys, options).source;
  });
  return new RegExp("(?:".concat(parts.join("|"), ")"), flags(options));
}
__name(arrayToRegexp, "arrayToRegexp");
function stringToRegexp(path, keys, options) {
  return tokensToRegexp(parse(path, options), keys, options);
}
__name(stringToRegexp, "stringToRegexp");
function tokensToRegexp(tokens, keys, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.strict, strict = _a === void 0 ? false : _a, _b = options.start, start = _b === void 0 ? true : _b, _c = options.end, end = _c === void 0 ? true : _c, _d = options.encode, encode = _d === void 0 ? function(x) {
    return x;
  } : _d, _e = options.delimiter, delimiter = _e === void 0 ? "/#?" : _e, _f = options.endsWith, endsWith = _f === void 0 ? "" : _f;
  var endsWithRe = "[".concat(escapeString(endsWith), "]|$");
  var delimiterRe = "[".concat(escapeString(delimiter), "]");
  var route = start ? "^" : "";
  for (var _i = 0, tokens_1 = tokens; _i < tokens_1.length; _i++) {
    var token = tokens_1[_i];
    if (typeof token === "string") {
      route += escapeString(encode(token));
    } else {
      var prefix = escapeString(encode(token.prefix));
      var suffix = escapeString(encode(token.suffix));
      if (token.pattern) {
        if (keys)
          keys.push(token);
        if (prefix || suffix) {
          if (token.modifier === "+" || token.modifier === "*") {
            var mod = token.modifier === "*" ? "?" : "";
            route += "(?:".concat(prefix, "((?:").concat(token.pattern, ")(?:").concat(suffix).concat(prefix, "(?:").concat(token.pattern, "))*)").concat(suffix, ")").concat(mod);
          } else {
            route += "(?:".concat(prefix, "(").concat(token.pattern, ")").concat(suffix, ")").concat(token.modifier);
          }
        } else {
          if (token.modifier === "+" || token.modifier === "*") {
            throw new TypeError('Can not repeat "'.concat(token.name, '" without a prefix and suffix'));
          }
          route += "(".concat(token.pattern, ")").concat(token.modifier);
        }
      } else {
        route += "(?:".concat(prefix).concat(suffix, ")").concat(token.modifier);
      }
    }
  }
  if (end) {
    if (!strict)
      route += "".concat(delimiterRe, "?");
    route += !options.endsWith ? "$" : "(?=".concat(endsWithRe, ")");
  } else {
    var endToken = tokens[tokens.length - 1];
    var isEndDelimited = typeof endToken === "string" ? delimiterRe.indexOf(endToken[endToken.length - 1]) > -1 : endToken === void 0;
    if (!strict) {
      route += "(?:".concat(delimiterRe, "(?=").concat(endsWithRe, "))?");
    }
    if (!isEndDelimited) {
      route += "(?=".concat(delimiterRe, "|").concat(endsWithRe, ")");
    }
  }
  return new RegExp(route, flags(options));
}
__name(tokensToRegexp, "tokensToRegexp");
function pathToRegexp(path, keys, options) {
  if (path instanceof RegExp)
    return regexpToRegexp(path, keys);
  if (Array.isArray(path))
    return arrayToRegexp(path, keys, options);
  return stringToRegexp(path, keys, options);
}
__name(pathToRegexp, "pathToRegexp");

// ../../../../usr/lib/node_modules/wrangler/templates/pages-template-worker.ts
var escapeRegex = /[.+?^${}()|[\]\\]/g;
function* executeRequest(request) {
  const requestPath = new URL(request.url).pathname;
  for (const route of [...routes].reverse()) {
    if (route.method && route.method !== request.method) {
      continue;
    }
    const routeMatcher = match(route.routePath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const mountMatcher = match(route.mountPath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const matchResult = routeMatcher(requestPath);
    const mountMatchResult = mountMatcher(requestPath);
    if (matchResult && mountMatchResult) {
      for (const handler of route.middlewares.flat()) {
        yield {
          handler,
          params: matchResult.params,
          path: mountMatchResult.path
        };
      }
    }
  }
  for (const route of routes) {
    if (route.method && route.method !== request.method) {
      continue;
    }
    const routeMatcher = match(route.routePath.replace(escapeRegex, "\\$&"), {
      end: true
    });
    const mountMatcher = match(route.mountPath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const matchResult = routeMatcher(requestPath);
    const mountMatchResult = mountMatcher(requestPath);
    if (matchResult && mountMatchResult && route.modules.length) {
      for (const handler of route.modules.flat()) {
        yield {
          handler,
          params: matchResult.params,
          path: matchResult.path
        };
      }
      break;
    }
  }
}
__name(executeRequest, "executeRequest");
var pages_template_worker_default = {
  async fetch(originalRequest, env2, workerContext) {
    let request = originalRequest;
    const handlerIterator = executeRequest(request);
    let data = {};
    let isFailOpen = false;
    const next = /* @__PURE__ */ __name(async (input, init) => {
      if (input !== void 0) {
        let url = input;
        if (typeof input === "string") {
          url = new URL(input, request.url).toString();
        }
        request = new Request(url, init);
      }
      const result = handlerIterator.next();
      if (result.done === false) {
        const { handler, params, path } = result.value;
        const context2 = {
          request: new Request(request.clone()),
          functionPath: path,
          next,
          params,
          get data() {
            return data;
          },
          set data(value) {
            if (typeof value !== "object" || value === null) {
              throw new Error("context.data must be an object");
            }
            data = value;
          },
          env: env2,
          waitUntil: workerContext.waitUntil.bind(workerContext),
          passThroughOnException: /* @__PURE__ */ __name(() => {
            isFailOpen = true;
          }, "passThroughOnException")
        };
        const response = await handler(context2);
        if (!(response instanceof Response)) {
          throw new Error("Your Pages function should return a Response");
        }
        return cloneResponse(response);
      } else if ("ASSETS") {
        const response = await env2["ASSETS"].fetch(request);
        return cloneResponse(response);
      } else {
        const response = await fetch(request);
        return cloneResponse(response);
      }
    }, "next");
    try {
      return await next();
    } catch (error3) {
      if (isFailOpen) {
        const response = await env2["ASSETS"].fetch(request);
        return cloneResponse(response);
      }
      throw error3;
    }
  }
};
var cloneResponse = /* @__PURE__ */ __name((response) => (
  // https://fetch.spec.whatwg.org/#null-body-status
  new Response(
    [101, 204, 205, 304].includes(response.status) ? null : response.body,
    response
  )
), "cloneResponse");
export {
  pages_template_worker_default as default
};
