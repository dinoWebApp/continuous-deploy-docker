import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { exec } from 'child_process';



@Injectable()
export class WebhookService {
  constructor(
    private configService:ConfigService,
  ) {}

  
  async handleWebhook(data): Promise<string> {
    const repoName = data.repository.repo_name;
    const name = data.repository.name;
    const tagName = data.push_data.tag;
    let dpFe = this.configService.get<string>('DPFE');
    let dpBe = this.configService.get<string>('DPBE');
    let tgolshop = this.configService.get<string>('TGOLSHOP');
    let genSql = this.configService.get<string>('GENSQL');
    let dpFeDir = this.configService.get<string>('DPFE_DIR');
    let dpBeDir = this.configService.get<string>('DPBE_DIR');
    let tgolshopDir = this.configService.get<string>('TGOLSHOP_DIR');
    let genSqlDir = this.configService.get<string>('GENSQL_DIR');
    console.log(data.push_data);

    if (!tagName) {
      console.error('Received an empty tag. Aborting operation.');
      return 'Webhook processing error due to missing or empty tagName!';
    }
    const runCommand = (command: string) =>{
      return new Promise((resolve, reject) =>{
        exec(command, (error, stdout, stderr)=>{
          if(error) {
            console.error(`exec error: ${error}`);
            reject(error);
          } else {
            resolve(stdout.trim());
          }
        });
      });
    };
    // 실행 중인 컨테이너 중에서 이미지 이름이 일치하는 것을 찾아 종료
    try {
      await runCommand(`docker stop ${name}`);
      console.log(`Stopped container with image: ${repoName}`);
    } catch(error) {
      console.error(`Error stopping container with image: ${repoName}`, error);
    }

    // 새 이미지를 pull하고 컨테이너를 실행

    try {
      await runCommand(`docker pull ${repoName}:${tagName}`);
      switch(repoName) {
        case dpFe:
          await runCommand(`docker run --rm --env-file ${dpFeDir} -d -p 3001:3000 --name ${name} ${repoName}:${tagName}`);
          console.log(`Started container with image: ${repoName}:${tagName}`);
          break;
        case dpBe:
          await runCommand(`docker run --rm --env-file ${dpBeDir} -d -p 3002:3000 --name ${name} ${repoName}:${tagName}`);
          console.log(`Started container with image: ${repoName}:${tagName}`);
          break;
        case tgolshop:
          await runCommand(`docker run --rm --env-file ${tgolshopDir} -d -p 3004:3000 --name ${name} ${repoName}:${tagName}`);
          console.log(`Started container with image: ${repoName}:${tagName}`);
          break;
        case genSql:
          await runCommand(`docker run --rm --env-file ${genSqlDir} -d -p 3005:3000 --name ${name} ${repoName}:${tagName}`);
          console.log(`Started container with image: ${repoName}:${tagName}`);
          break;  
        default:
          console.log('This image is not supported');
      }
      
    } catch (error) {
      console.error(`Error starting container with image: ${repoName}:${tagName}`, error);
    }

    return 'Webhook processed!';

  }
}
