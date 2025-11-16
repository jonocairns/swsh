const logVoice = (...args: unknown[]) => {
  console.log(
    '%c[VOICE-PROVIDER]',
    'color: salmon; font-weight: bold;',
    ...args
  );
};

export { logVoice };
