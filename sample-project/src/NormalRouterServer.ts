/**
 * Examples for the Overnight web-framework.
 *
 * created by Sean Maxwell Aug 26, 2018
 */

import * as bodyParser      from 'body-parser'
import * as controllers     from './controllers/controllers'

import { Server }           from '@overnightjs/core'
import { cinfo, cimp }      from 'simple-color-print'
import { MailPromise }      from 'mail-promise'
import { SampleController } from './controllers/SampleController'

declare interface Controllers {
    [name: string]: typeof SampleController,
}

export class NormalRouterServer extends Server
{
    constructor()
    {
        super()
        this.setupExpress()
        let ctrls = this.setupControllers()
        super.addControllers_(ctrls)
    }

    private setupExpress(): void
    {
        // Setup express here like you would
        // any other ExpressJS application.
        this.app_.use(bodyParser.json())
        this.app_.use(bodyParser.urlencoded({extended: true}))
    }

    private setupControllers(): Array<SampleController>
    {
        let mailer = new MailPromise('Gmail', process.env.EMAILUSER,
            process.env.EMAILPWD)

        let ctlrs = []
        for(let name in controllers) {
            let Controller = (<Controllers>controllers)[name]
            let controller = new Controller()

            controller.setMailer(mailer)
            ctlrs.push(controller)
        }

        return ctlrs
    }

    public start(port?: number)
    {
        port = port ? port : 3000

        this.app_.get('/home', (req, res) => {
            res.send('overnightjs with standard express router started')
        })

        this.app_.listen(port, () => {
            cimp('overnightjs with standard express router started on port:' + port)
        })
    }
}