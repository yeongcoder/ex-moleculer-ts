"use strict";

import {Service, ServiceBroker, Context} from "moleculer";
import { createAdapter as RedisAdapter } from 'socket.io-redis';
import { started } from "../../../moleculer.config";

const SocketIOService = require("moleculer-io");
const AmqpAdapter = require("socket.io-amqp");

const PortNum = Math.floor(Math.random() * (4000 - 3000) + 3000);

export default class MessageService extends Service {

	public constructor(public broker: ServiceBroker) {
		super(broker);
		this.parseServiceSchema({
			name: "message",
			version: 2,
			mixins: [SocketIOService],

			settings: {
				port: process.env.PORT || 3001,
				io: {
					options: {
						//adapter: RedisAdapter("redis://localhost:6379")
						//adapter: AmqpAdapter("amqp://root:\@uc898911@115.85.180.58:5672")
				  	},
					namespaces: {
						'/': {
							authorization: true,
							middlewares: [],
							packetMiddlewares: [],
							events: {
								'call': {
									mappingPolicy: 'all',
									aliases: {
										'join': 'message.join',
										'leave': 'message.leave',
										'chat': 'message.chat',
									},
									whitelist: [
									  '**'
									],
									callOptions: {},
									onBeforeCall: async function(ctx:any, socket:any, args:any){
										ctx.meta.socket = socket;
									},
									onAfterCall:async function(ctx:any, socket:any, data:any){

									}
								},
								'call02': {
									mappingPolicy: 'all',
									aliases: {
										'hello': 'greeter.hello'
									},
									whitelist: [
									  '**'
									],
								}
							}
						}
					}
				},
			},

			actions:{
				chat: {
					params: {
						test: "string",
						room: "string"
					},
					async handler(ctx:Context<{text: string, room: string},any>): Promise<number> {

						console.log("ctx.meta.$rooms: ", ctx.meta.$rooms);
						console.log("ctx.meta.$user: ", ctx.meta.$user);

						this.logger.info(`"${ctx.meta.socket.id}" chat : ${ctx.params.text}`);

						ctx.meta.socket.to(ctx.params.room).emit('chat',`${ctx.meta.socket.id}: ${ctx.params.text}`);

						return 0;
					},
				},
				join: {
					params: {
						room: "string"
					},
					async handler(ctx:Context<{ room: string },any>): Promise<number> {

						this.logger.info(`"${ctx.meta.socket.id}" join to ${ctx.params.room}`);

						ctx.meta.socket.to(ctx.params.room).emit('noti',`"${ctx.meta.socket.id}" join`);

						ctx.meta.$join = ctx.params.room;

						return 0;
					},
				},
				leave: {
					params: {
						room: "string"
					},
					async handler(ctx:Context<{ room: string },any>): Promise<number> {

						this.logger.info(`"${ctx.meta.socket.id}" leave from ${ctx.params.room}`);

						ctx.meta.socket.to(ctx.params.room).emit('noti',`"${ctx.meta.socket.id}" leave`);

						ctx.meta.$leave = ctx.params.room;

						return 0;
					},
				}
			},

			methods: {

				async socketAuthorize(socket:any, eventHandler:any){
					this.logger.info("Socket Authorize!");
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
					// throw new ApiGatewayService.Errors.UnAuthorizedError(ApiGatewayService.Errors.ERR_INVALID_TOKEN, {
					// 	error: "Invalid Token",
					// });
					// let res = await this.broker.call("greeter.hello");
					// this.logger.info('greeter res:', res);\
					//await this.broker.call("greeter.hello");
					
				}
			},

			created(){
				this.logger.info("Listen Port:", PortNum);
			}
		});
	}
}
