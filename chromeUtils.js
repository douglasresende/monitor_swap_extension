// chromeUtils.js

function onExtensionInstalled(listener){
  chromeRuntimeOnInstalledAddListener(listener);
}

function getActive() {
  return chromeStorageLocalGet('monitor_active');
}

function setActive(activeValue) {
  return chromeStorageLocalSet({ monitor_active: activeValue });
}

function getActiveAutoClick() {
  return chromeStorageLocalGet('monitor_active_auto_click');
}

function setActiveAutoClick(activeValue) {
  return chromeStorageLocalSet({ monitor_active_auto_click: activeValue });
}

function getSpeed(){
  return chromeStorageLocalGet('monitor_speed');
}

function setSpeed(speedValue) {
  return chromeStorageLocalSet({ monitor_speed: speedValue });
}

function getCoinType() {
  return chromeStorageLocalGet('monitor_coin_type');
}

function setCoinType(coinTypeValue) {
  return chromeStorageLocalSet({ monitor_coin_type: coinTypeValue });
}

function getTelegramActive() {
  return chromeStorageLocalGet('monitor_telegram_active');
}

function setTelegramActive(activeValue) {
  return chromeStorageLocalSet({ monitor_telegram_active: activeValue });
}

function getTelegramChatId() {
  return chromeStorageLocalGet('monitor_telegram_chat_id');
}

function setTelegramChatId(value) {
  return chromeStorageLocalSet({ monitor_telegram_chat_id: value });
}

function getTelegramChatToken() {
  return chromeStorageLocalGet('monitor_telegram_chat_token');
}

function setTelegramChatToken(value) {
  return chromeStorageLocalSet({ monitor_telegram_chat_token: value });
}

function getTelegramSoundActive() {
  return chromeStorageLocalGet('monitor_telegram_sound_active');
}

function setTelegramSoundActive(activeValue) {
  return chromeStorageLocalSet({ monitor_telegram_sound_active: activeValue });
}

function onMessage(listener){
  chromeRuntimeOnMessageAddListener(listener);
}

// ENVIAR MSG PRA TODAS AS ABAS ABERTAS
async function sendMessage(message) {
  const tabs = await chromeTabsQuery();
  for (tab of tabs) {
    chromeTabsSendMessage(tab.id, message);
  }
}

// Chrome API

function chromeRuntimeOnMessageAddListener(listener) {
  chrome.runtime.onMessage.addListener(listener);
}

function chromeTabsSendMessage(tabId, message) {
  chrome.tabs.sendMessage(tabId, message);
}

function chromeRuntimeOnInstalledAddListener(listener) {
  chrome.runtime.onInstalled.addListener(listener);
}

// https://developer.chrome.com/docs/apps/manifest/storage/
function chromeStorageLocalGet(key) {
  return new Promise((resolve) =>
    chrome.storage.local.get([key], (result) => {
      resolve(result[key]);
    })
  );
}

function chromeStorageLocalSet(object){
  return new Promise((resolve) => chrome.storage.local.set(object, resolve));
}

// chrome.storage.local.clear

function chromeTabsQuery(){
  return new Promise((resolve) => chrome.tabs.query({}, resolve));
}
