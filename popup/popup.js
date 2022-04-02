// PEGAR INFORMACOES DO POPUP E SALVAR / PERSISTIR

const NORMALIZED_RATE = 10;
const activeField = document.getElementById('active');
const activeAutoClickField = document.getElementById('active_auto_click');
const speedTxt = document.getElementById('speed');
const speedRange = document.getElementById('speedRange');
const coinType = document.getElementById('coinType');
const telegramActiveField = document.getElementById('telegram_active');
const telegramChatId = document.getElementById('telegram_chat_id');
const telegramChatToken = document.getElementById('telegram_chat_token');
const telegramTestButton = document.getElementById('telegram_test_button');
const openUsdtTabsButton = document.getElementById('open_usdt_tabs_button');
const showAllValuesButton = document.getElementById('show_all_values_button');
const saveButton = document.getElementById('save');

// ESTADO DA APLICACAO
let initialState,
  state = {
    monitor_active: false,
    monitor_active_auto_click: false,
    monitor_speed: 1,
    monitor_coin_type: "",
    monitor_telegram_active: false,
    monitor_telegram_chat_id: "",
    monitor_telegram_chat_token: "",
  };

(async function(){
  // CARREGAR O ESTADO DA APP
  state = await getInitialState();
  // CRIANDO UMA COPIA DO OBJETO
  initialState = { ...state };

  updateActiveField();
  addListenerActiveField();

  updateActiveAutoClickField();
  addListenerActiveAutoClickField();

  updateSpeed();
  addListenerRange();

  updateCoinType();
  addListenerCoinType();

  updateTelegramActiveField();
  addListenerTelegramActiveField();

  updateTelegramChatId();
  addListenerTelegramChatId();

  updateTelegramChatToken();
  addListenerTelegramChatToken();

  addListenerButton();
  addListenerTelegramButton();

  addListenerOpenUsdtTabsButton();
  addListenerShowAllValuesButton();
})();

// Active
async function getInitialState(){
  return {
    monitor_active: await getActive(),
    monitor_active_auto_click: await getActiveAutoClick(),
    monitor_speed: await getSpeed(),
    monitor_coin_type: await getCoinType(),
    monitor_telegram_active: await getTelegramActive(),
    monitor_telegram_chat_id: await getTelegramChatId(),
    monitor_telegram_chat_token: await getTelegramChatToken(),
  }
}

// Monitor Active?
function updateActiveField(){
  activeField.checked = state.monitor_active;
}

function addListenerActiveField(){
  activeField.onclick = (event) => {
    onActiveFieldClicked(event)
  };
}

function onActiveFieldClicked(event){
  state.monitor_active = event.target.checked;
  updateActiveField();
}

// AutoClick Active?
function updateActiveAutoClickField(){
  activeAutoClickField.checked = state.monitor_active_auto_click;
}

function addListenerActiveAutoClickField(){
  activeAutoClickField.onclick = (event) => {
    onActiveAutoClickFieldClicked(event)
  };
}

function onActiveAutoClickFieldClicked(event){
  state.monitor_active_auto_click = event.target.checked;
  updateActiveAutoClickField();
}

// Speed
function updateSpeed(){
  speedRange.value = getNormalizedSpeed(state.monitor_speed);
  speedTxt.innerText = state.monitor_speed;
}

function getNormalizedSpeed(speed){
  return speed * NORMALIZED_RATE;
}

function addListenerRange(){
  speedRange.oninput = onRangeValueChange;
}

function onRangeValueChange(){
  state.monitor_speed = getRealSpeed(this.value);
  updateSpeed();
}

function getRealSpeed(speed){
  return speed / NORMALIZED_RATE;
}

function addListenerButton(){
  saveButton.onclick = (event) => {
    onSaveButtonClick(event);
  };
}

// Telegram Test Button
function addListenerTelegramButton(){
  telegramTestButton.onclick = (event) => {
    onTelegramTestButtonClick(event);
  };
}

// Open USDT Tabs Button
function addListenerOpenUsdtTabsButton(){
  openUsdtTabsButton.onclick = (event) => {
    sendMessage('monitor_open_all_usdt_tabs');
  };
}

// Show All Values Button
function addListenerShowAllValuesButton(){
  showAllValuesButton.onclick = (event) => {
    sendMessage('monitor_show_all_values');
  };
}

// Coin Type
function updateCoinType(){
  coinType.value = state.monitor_coin_type;
}

function addListenerCoinType(){
  coinType.oninput = (event) => {
    onCoinTypeClicked(event)
  };
}

function onCoinTypeClicked(event){
  state.monitor_coin_type = event.target.value;
  updateCoinType();
}

// Telegram Active
function updateTelegramActiveField(){
  telegramActiveField.checked = state.monitor_telegram_active;
}

function addListenerTelegramActiveField(){
  telegramActiveField.onclick = (event) => {
    onTelegramActiveFieldClicked(event)
  };
}

function onTelegramActiveFieldClicked(event){
  state.monitor_telegram_active = event.target.checked;
  updateTelegramActiveField();
}

// Telegram ChatId
function updateTelegramChatId(){
  telegramChatId.value = state.monitor_telegram_chat_id;
}

function addListenerTelegramChatId(){
  telegramChatId.oninput = (event) => {
    onTelegramChatIdClicked(event)
  };
}

function onTelegramChatIdClicked(event){
  state.monitor_telegram_chat_id = event.target.value;
  updateTelegramChatId();
}

// Telegram ChatToken
function updateTelegramChatToken(){
  telegramChatToken.value = state.monitor_telegram_chat_token;
}

function addListenerTelegramChatToken(){
  telegramChatToken.oninput = (event) => {
    onTelegramChatTokenClicked(event)
  };
}

function onTelegramChatTokenClicked(event){
  state.monitor_telegram_chat_token = event.target.value;
  updateTelegramChatToken();
}

// Save Button
async function onSaveButtonClick(event) {
  setSavingText(event.target);
  // VERIFICAR SE ESTADO ATUAL E DIFERENTE DO ATUAL
  if(state.monitor_active_auto_click   != initialState.monitor_active_auto_click)   await saveActiveAutoClick();
  if(state.monitor_speed               != initialState.monitor_speed)               await saveSpeed();
  if(state.monitor_coin_type           != initialState.monitor_coin_type)           await saveCoinType();
  if(state.monitor_telegram_active     != initialState.monitor_telegram_active)     await saveTelegramActive();
  if(state.monitor_telegram_chat_id    != initialState.monitor_telegram_chat_id)    await saveTelegramChatId();
  if(state.monitor_telegram_chat_token != initialState.monitor_telegram_chat_token) await saveTelegramChatToken();
  await sendMessage('monitor_update_attributes');
  if(state.monitor_active              != initialState.monitor_active)              await saveActive();
  initialState = { ...state };
}

function setSavingText(element) {
  element.innerText = '...';
  setTimeout(() => {
    element.innerText = 'Salvar';
  },300);
}

async function saveActive(){
  await setActive(state.monitor_active);
  if (state.monitor_active) await sendMessage('monitor_activate');
  else await sendMessage('monitor_deactivate');
}

async function saveActiveAutoClick(){
  await setActiveAutoClick(state.monitor_active_auto_click);
}

async function saveSpeed(){
  await setSpeed(state.monitor_speed);
  // await sendMessage('monitor_speedChanged');
}

async function saveCoinType(){
  await setCoinType(state.monitor_coin_type);
}

async function saveTelegramActive(){
  await setTelegramActive(state.monitor_telegram_active);
}

async function saveTelegramChatId(){
  await setTelegramChatId(state.monitor_telegram_chat_id);
}

async function saveTelegramChatToken(){
  await setTelegramChatToken(state.monitor_telegram_chat_token);
}

async function onTelegramTestButtonClick(event) {
  try {
    let message = 'Monitor Swapnex: Teste de mensagem.';
    let options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: message,
        parse_mode: 'Markdown',
        disable_web_page_preview: false,
        disable_notification: true,
        chat_id: state.monitor_telegram_chat_id
      })
    };

    fetch('https://api.telegram.org/bot'+state.monitor_telegram_chat_token+'/sendMessage', options).then(response => response.json()).then(response => console.log(response)).catch(err => console.error(err));
  } catch (e) {
    console.error(e);
  }
}
