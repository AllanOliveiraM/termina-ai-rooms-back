import { injectRuntimeEnvs } from '@app/common/app-ignition/runtime'

const ignite = async () => {
  await injectRuntimeEnvs()

  await (await import('./app')).bootstrap()
}

ignite()
