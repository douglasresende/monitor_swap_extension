// content.js

class MonitorSwapnex {
  constructor() {
    this.usar_monitor           = true;  // true = SIM / false = NAO
    this.usar_auto_click        = true;  // true = SIM / false = NAO
    this.valor_alerta           = 1.05;  // PERCENT
    this.valor_max_alerta       = 3.0;   // PERCENT // GERALMENTE NAO ACEITA EMITIR ORDEM COM VALOR ACIMA DE 3%
    this.valor_alerta_no_titulo = 0.7;   // PERCENT
    this.telegram_active        = false; // true = SIM / false = NAO
    this.telegram_chat_id       = '';
    this.telegram_chat_token = '';
    this.telegram_sound_active        = false; // true = SIM / false = NAO
    this.ultimo_maior_valor     = 0;
    this.setCampoMaiorValor();
  }

  ligarMonitor(){
    // SE TIVER NA TELA DE ORDEM MANUAL
    if (document.documentURI.slice(0, 35) == "https://swapnex.io/products/manual/"){
      this.selecionarCoinType();
      this.ligar();
      if (this.telegram_active){
        this.ligarNotificacaoNoTelegram();
      }
    }
  }

  ligar() {
    this.id_interval = setInterval(this.descobrirMelhorValor.bind(this), 3000);
  }

  desligar() {
    clearInterval(this.id_interval);
  }

  selecionarCoinType() {
    $('div[manual_ps="'+state.monitor_coin_type+'"]').first().trigger('click');
  }

  setCampoMaiorValor() {
    if (document.documentURI.slice(0, 35) == "https://swapnex.io/products/manual/"){
      this.campo_maior_valor = $('.block_title_border_none > div').first();
      this.campo_maior_valor.html('').data('maior_valor', 0.0).data('maior_valor_data', ((new Date()).toString().slice(16, 24))).data('historico',[]);
    }
  }

  mostrarEstatistica() {
    var str_max  = this.campo_maior_valor.data('maior_valor').toFixed(2);
    var str_data = this.campo_maior_valor.data('maior_valor_data');
    var str = '';
    str += 'MAX: '+str_max+'% às '+str_data+' &nbsp;&nbsp;&nbsp;';
    this.campo_maior_valor.html(str);
  }

  getCurrentValue() {
    return parseFloat($("span[manual_profit_parcent]").html().replace('%',''));
  }

  mostrarUltimoMaiorValor(){
    document.title = this.ultimo_maior_valor;
  }

  async descobrirMelhorValor() {
    var maior_valor = { bolsa_1: 0, bolsa_2: 0, valor: 0 };
    $('input[name="left"]').map(function(x){
      if($(this).parent().parent().parent().parent().parent().parent().find('div:first').find('div:last')[0].innerHTML != '-'){
        // SELECIONAR PRIMEIRA BOLSA
        this.click();
        $('input[name="right"]').map(function(y){
          if($(this).parent().parent().parent().parent().parent().find('div:last')[0].innerHTML != '-'){
            // SELECIONAR SEGUNDA BOLSA
            this.click();
            var current_value = parseFloat($("span[manual_profit_parcent]").html().replace('%',''));
            if (maior_valor['valor'] < current_value && current_value <= 3.0) {
              maior_valor['bolsa_1'] = (x+1);
              maior_valor['bolsa_2'] = (y+1);
              maior_valor['valor'] = current_value;
            }
          }
        })
      }
    });
    if(maior_valor['bolsa_1'] > 0 && maior_valor['bolsa_2'] > 0){
      // CLICA NA PRIMEIRA BOLSA
      $('input[name="left"]')[maior_valor['bolsa_1']-1].click();
      // CLICA NA SEGUNDA BOLSA
      $('input[name="right"]')[maior_valor['bolsa_2']-1].click();

      // SE VALOR MAIOR QUE 0.7% MOSTRAR MELHOR VALOR NO TITULO DA PAGINA
      this.ultimo_maior_valor = maior_valor['valor'];
      if (maior_valor['valor'] >= this.valor_alerta_no_titulo){
        document.title = maior_valor['valor'];
      } else {
        document.title = '.';
      }

      // MOSTRAR MAIOR VALOR JA REGISTRADO HOJE
      if(this.campo_maior_valor.data('maior_valor') < maior_valor['valor']){
        this.campo_maior_valor.data('maior_valor', maior_valor['valor']);
        this.campo_maior_valor.data('maior_valor_data', ((new Date()).toString().slice(16, 24)));
      }

      if (this.usar_monitor && this.usar_auto_click && maior_valor['valor'] >= this.valor_alerta && maior_valor['valor'] <= this.valor_max_alerta){
        $('button[class="btn_order"]').first().trigger('click');
        this.usar_monitor = false;
        this.notificarTelegram();
        setActive(false);
        this.desligar();
      }
    }

    this.mostrarEstatistica();
  }

  nomeBolsa1(){
    return $($('.btn_select_inner > span')[1]).html();
  }

  nomeBolsa2(){
    return $($('.btn_select_inner > span')[3]).html();
  }

  nomeMoeda1(){
    return $('.input_currency_percent > div').first().html();
  }

  nomeMoeda2(){
    return $($('.select_exchange_td_price > div')[2]).html();
  }

  getTelegramMessage(){
    // 1.12%  USDT / BTC  (Binance / Coinbase Pro)
    return '*'+this.getCurrentValue()+'%*  '+this.nomeMoeda1()+' / '+this.nomeMoeda2()+'  ('+this.nomeBolsa1()+' / '+this.nomeBolsa2()+')';
  }

  notificarTelegram(){
    if(this.telegram_active) {
      try {
        var message = this.getTelegramMessage().replace('.','\.').replace('-','\-');
        var options = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: message,
            parse_mode: 'Markdown',
            disable_web_page_preview: false,
            disable_notification: !this.telegram_sound_active,
            chat_id: this.telegram_chat_id
          })
        };

        fetch('https://api.telegram.org/bot'+this.telegram_chat_token+'/sendMessage', options).then(response => response.json()).then(response => console.log(response)).catch(err => console.error(err));
      } catch (e) {
        console.error(e);
      }
    }
  }

  ligarNotificacaoNoTelegram(){
    this.telegram_active = true;
  }

  desligarNotificacaoNoTelegram() {
    this.telegram_active = false;
  }

}

const NORMAL_SPEED = 1;

const state = {
  monitor_active: null,
  monitor_active_auto_click: false,
  monitor_speed: null,
  monitor_coin_type: 115,
  monitor_telegram_active: false,
  monitor_telegram_chat_id: null,
  monitor_telegram_chat_token: null,
  monitor_telegram_sound_active: false,
  monitor_swapnex_auto_click: new MonitorSwapnex(),
};

// FUNCAO QUE SE AUTO EXECUTA
(function(){
  activate();
})();

async function monitorUpdateAttributes(){
  state.monitor_coin_type = await getCoinType();
  state.monitor_telegram_active = await getTelegramActive();
  state.monitor_telegram_chat_id = await getTelegramChatId();
  state.monitor_telegram_chat_token = await getTelegramChatToken();
  state.monitor_telegram_sound_active = await getTelegramSoundActive();

  state.monitor_swapnex_auto_click.telegram_active = state.monitor_telegram_active;
  state.monitor_swapnex_auto_click.telegram_chat_id = state.monitor_telegram_chat_id;
  state.monitor_swapnex_auto_click.telegram_chat_token = state.monitor_telegram_chat_token;
  state.monitor_swapnex_auto_click.telegram_sound_active = state.monitor_telegram_sound_active;

  state.monitor_active_auto_click = await getActiveAutoClick();
  state.monitor_swapnex_auto_click.usar_auto_click = state.monitor_active_auto_click;

  state.monitor_speed = await getSpeed();
  state.monitor_swapnex_auto_click.valor_alerta = state.monitor_speed;
}
async function activate(){
  monitorUpdateAttributes();
  // VERIFICAR SE A EXTENSAO TA ATIVA
  state.monitor_active = await getActive();
  // SE NAO TIVER ATIVA, PARAR EXECUCAO
  if(!state.monitor_active) return;

  state.monitor_swapnex_auto_click.ligarMonitor();
}

onMessage(messageActions);

function messageActions(message){
  switch (message) {
    case 'monitor_speedChanged':
      if (state.monitor_active) updateAndSetSpeed();
      break;
    case 'monitor_activate':
      activate();
      break;
    case 'monitor_deactivate':
      deactivate();
      break;
    case 'monitor_show_all_values':
      state.monitor_swapnex_auto_click.mostrarUltimoMaiorValor();
      break;
    case 'monitor_open_all_usdt_tabs':
      openAllUsdtTabs();
      break;
    case 'monitor_update_attributes':
      monitorUpdateAttributes();
      break;
  }
}

function openAllUsdtTabs(){
  var locs = ['5','10','6','7','8','12','14','16','18','20','22'];
  for (let i = 0; i < locs.length; i++) {
    window.open('https://swapnex.io/products/manual/'+locs[i], '_blank');
  };
}

async function updateAndSetSpeed(){
  state.monitor_speed = await getSpeed();
}

async function deactivate(){
  state.monitor_active = await getActive();
  if (state.monitor_active) return;
  // SE TIVER NA TELA DE ORDEM MANUAL
  if (document.documentURI.slice(0, 35) == "https://swapnex.io/products/manual/"){
    state.monitor_swapnex_auto_click.desligar();
  }
}

