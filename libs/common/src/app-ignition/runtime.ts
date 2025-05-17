export const injectRuntimeEnvs = async () => {
  process.env.TZ = 'UTC'

  const dotenv = await import('dotenv')

  dotenv.config()

  console.info('Env Definitions loaded.')
}
