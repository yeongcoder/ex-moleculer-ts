// pm2 나 moleculer-runner 로 클러스터로 실행된 로컬내의 멀티 인스터스들에게는 하나로만 RoundRobin 시키므로 moleculer.config.js의 preferLocal 를 false 로 하면된다
import { ServiceBroker } from "moleculer";
import config from "../../moleculer.config"

const broker:ServiceBroker = new ServiceBroker(config); // https://dankuida.com/moleculer-deployment-thoughts-8e0fc8c0fb07

broker.loadService("./services/gateway/socket.service");
broker.loadServices("./services/math", "**/*.service.ts");

broker.start();

/***
    // pm2 명령어 : https://d4emon.tistory.com/128
    pm2 start app.js            // fork 모드
    pm2 list
    pm2 monit
    pm2 logs                    // view logs for all processes 
    
    pm2 reload all
    //pm2 restart all           // restart all apps
    pm2 stop all                // stop all apps
    pm2 delete all              // #kill and remove all apps
    
    pm2 start ecosystem.json    // https://blog.outsider.ne.kr/1197
    pm2 start app.js -i 2       // cluster 모드
    pm2 scale app.js 3          // scaling
***/