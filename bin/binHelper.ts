export const getArgs = <TArgs = { [p: string]: boolean | string | number }>(): TArgs => {
  const args = process.argv.slice(2);
  const formattedArgs: { [key: string]: boolean | string | number } = {};

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg.startsWith('--')) {
      const [key, value] = arg.substring(2).split('=');
      formattedArgs[key] = value ? value : true;
    }
  }

  return formattedArgs as TArgs;
};
