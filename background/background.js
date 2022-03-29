// Background.js

const NORMAL_SPEED = 1;

onExtensionInstalled(setInitial);

function setInitial(){
  setInitialActive();
  setInitialSpeed();
  setInitialCoinType();
  setInitialTelegramActive();
  setInitialTelegramChatId();
  setInitialTelegramChatToken();
}

async function setInitialActive(){
  const monitor_active = await getActive();
  if (monitor_active == null) await setActive(true);
}

async function setInitialSpeed(){
  const monitor_speed = await getSpeed();
  if (monitor_speed == null) await setSpeed(NORMAL_SPEED);
}

async function setInitialCoinType(){
  const monitor_coin_type = await getCoinType();
  if (monitor_coin_type == null) await setCoinType(115);
}

async function setInitialTelegramActive(){
  const monitor_telegram_active = await getTelegramActive();
  if (monitor_telegram_active == null) await setTelegramActive(false);
}

async function setInitialTelegramChatId(){
  const monitor_telegram_chat_id = await getTelegramChatId();
  if (monitor_telegram_chat_id == null) await setTelegramChatId('');
}

async function setInitialTelegramChatToken(){
  const monitor_telegram_chat_token = await getTelegramChatToken();
  if (monitor_telegram_chat_token == null) await setTelegramChatToken('');
}
