/**
 * Show downvotes in chat
 * only mods can use this
 */

/*global Dubtrack */
import userIsAtLeastMod from '../utils/modcheck.js';

var myModule = {};
myModule.id = "dubplus-downdubs";
myModule.moduleName = "Downdubs in Chat";
myModule.description = "Toggle showing downdubs in the chat box";
myModule.category = "General";

myModule.downdubWatcher = function(e) {
  var user = Dubtrack.session.get('username');
  var currentDj = Dubtrack.room.users.collection.findWhere({
    userid: Dubtrack.room.player.activeSong.attributes.song.userid
  }).attributes._user.username;

  if(user === currentDj && e.dubtype === 'downdub'){
    let newChat = `
      <li class="dubplus-chat-system dubplus-chat-system-downdub">
        <div class="chatDelete" onclick="dubplus.deleteChatMessageClientSide(this)">
          <span class="icon-close"></span>
        </div>
        <div class="text">
          @${e.user.username} has downdubbed your song ${Dubtrack.room.player.activeSong.attributes.songInfo.name}
        </div>
      </li>`;

    $('ul.chat-main').append(newChat);
  }
};

myModule.turnOn = function() {
  Dubtrack.Events.bind("realtime:room_playlist-dub", this.downdubWatcher);

  // add this function to our global dubplus object so that downdubbed chat
  // items can be deleted
  if (typeof window.dubplus.deleteChatMessageClientSide !== 'function') {
    window.dubplus.deleteChatMessageClientSide = function(el){
      $(el).parent('li')[0].remove();
    };
  }
  
};

myModule.turnOff = function() {
  Dubtrack.Events.unbind("realtime:room_playlist-dub", this.downdubWatcher);
};

module.exports = myModule;
