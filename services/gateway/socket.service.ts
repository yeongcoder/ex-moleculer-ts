import {Service, ServiceBroker, Context} from "moleculer";
const SocketIOService = require("moleculer-io");

export default class SocketService extends Service {

	public constructor(broker: ServiceBroker) {
		super(broker);
		// @ts-ignore
		this.parseServiceSchema({
			name: "SocketGateway",
			mixins: [SocketIOService],
			// More info about settings: https://moleculer.services/docs/0.14/moleculer-web.html
			settings: {
				port: process.env.PORT || 3001,

				io: {
					namespaces: {
						'/': {
							authorization: true,
							middlewares: [],
							packetMiddlewares: [],
							events: {
								'call': {
									mappingPolicy: 'all',
									aliases: {
									  'add': 'math.add'
									},
									whitelist: [
									  'math.*'
									],
									callOptions: {},
									onBeforeCall: async function(ctx:any, socket:any, args:any){
										console.log("beforeCall!!!!!");
										ctx.meta.socketid = socket.id
										ctx.meta.socket = socket;
									},
									onAfterCall:async function(ctx:any, socket:any, data:any){
										console.log("afterCall!!!!!");
										socket.emit('afterCall', data)
									}
								},
							}
						}
					}
				},
				// Do not log client side errors (does not log an error response when the error.code is 400<=X<500)
				log4XXResponses: false,
				// Logging the request parameters. Set to any log level to enable it. E.g. "info"
				logRequestParams: null,
				// Logging the response data. Set to any log level to enable it. E.g. "info"
				logResponseData: null,
			},

			methods: {

				async socketAuthorize(socket:any, eventHandler:any){
					// let accessToken = socket.handshake.query.token
					// if (accessToken) {
					// 	try{
					// 	let user = await this.broker.call("user.verifyToken", {accessToken})
					// 	return {id: user.id, email: user.email, token: accessToken}  // valid credential, return the user
					// 	}catch(err){
					// 	throw new ApiGateway.Errors.UnAuthorizedError(ApiGateway.Errors.ERR_INVALID_TOKEN, {
					// 		error: "Invalid Token",
					// 	});
					// 	}
					// } else {
					// 	// anonymous user
					// 	return
					// }
					this.logger.info("Socket Authorize!");
				}
			},

		});
	}
}
