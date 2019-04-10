declare let audioinput: any;

import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Platform } from 'ionic-angular';
import { File } from '@ionic-native/file';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
	audioDataBuffer: any[];
	totalReceivedData: number = 0;

  	constructor(public navCtrl: NavController, public platform: Platform, public _file: File) {
  		console.log('construtor')
  	}

  	ionViewDidLoad () {	
  		console.log(this._file.dataDirectory);

		console.log("Load!");
		this.platform.ready().then(() => { 
			console.log('Ready')

			// SAMUEL
			// É isso aqui que eu estava testando quando parou de funcionar 
			window.addEventListener('audioinput', this.onAudioInputCapture, false);
			window.addEventListener('audioinputerror', this.onAudioInputError, false);
		});
	}

	onAudioInputCapture(evt) {
		console.log('capture')
		console.log(evt.data)
	    try {
	        if (evt && evt.data) {
	            // Increase the debug counter for received data
	            this.totalReceivedData += evt.data.length;

	            // Add the chunk to the buffer
	            this.audioDataBuffer = this.audioDataBuffer.concat(evt.data);
	        }
	    }
	    catch (ex) {
	        alert("onAudioInputCapture ex: " + ex);
	    }
	}

	/**
	 * Called when a plugin error happens.
	 */
	onAudioInputError(error) {
	    alert("onAudioInputError event recieved: " + JSON.stringify(error));
	}

  	record() {
		if (audioinput.isCapturing())
			return;

		let options = {
			sampleRate: 44100,
			bufferSize: 16384,
			channels: 2, // 1 - Mono, 2 - Stereo
			format: audioinput.FORMAT.PCM_16BIT,
			audioSourceType: audioinput.AUDIOSOURCE_TYPE.VOICE_COMMUNICATION,
			audioContext: this.audioContext
		};

		audioinput.initialize(options, () => {
			audioinput.checkMicrophonePermission((hasPermission) => {
	            if(hasPermission){
	                console.warn('Já tem permissão para acessar o microfone');
	                this.start();
	            } else {
	                console.warn('Sem permissão para acessar o microfone');
	                console.warn('Perguntando...');
	                audioinput.getMicrophonePermission((hasPermission, message) => {
	                    if(hasPermission) {
	                        console.warn('Usuário permitiu');
	                        this.start();
	                    } else {
	                        console.warn('Usuário rejeitou');
	                    }
	                });
	            }
	        });
			console.log('init');
		})
	}

  	start () {
  		if (audioinput) {
  			console.log('start')

  			var dir = this._file.externalDataDirectory;
  			console.log(dir);
		  this._file.createFile(dir, "test.mp3", true).then((result) => {
		      audioinput.start({
	        	sampleRate: 44100,
				bufferSize: 16384,
				channels: 2, // 1 - Mono, 2 - Stereo
				format: audioinput.FORMAT.PCM_16BIT,
				audioSourceType: audioinput.AUDIOSOURCE_TYPE.VOICE_COMMUNICATION,
				audioContext: this.audioContext,
		        fileUrl: dir + '/test.mp3'
		      })
		    }).catch((e) => {
		      	console.log(e);
		      });;
			//audioinput.start({streamToWebAudio: true});
		}
  	}

  	stop() {
		try {
			if (audioinput) {
        		if (audioinput.isCapturing()) {
					console.log("Stop");
                	audioinput.stop();

                	// !!!!!!!!!!!!! AQUI !!!!!!!!!!!
                	// Precisamos gravar o arquivo e enviar...
            	}
        	}
    	}
    	catch (e) {
        	alert("Erro: " + e);
    	}
  	}

  	play() {
  		console.log('Reproduzir');
  	}
}
