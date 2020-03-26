'use strict';

if(process.env.NODE_ENV === 'production') {
	module.exports = {
		Discord: {
			Token:process.env.Token
		},
		Genius: {
			ClientAccessToken:process.env.ClientAccessToken
		},
		Wit: {
			accessToken:process.env.accessToken
		}
	}
} else {
	module.exports = require('./development.json');
}
