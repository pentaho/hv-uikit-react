import createAngularPreset from "conventional-changelog-angular";

export default async function createPreset(config) {
  const preset = await createAngularPreset(config);

  return {
    ...preset,
    writer: {
      ...preset.writer,
      // overrides for prettier-compatible lists (`-` instead of `*`)
      commitPartial: preset.writer.commitPartial.replace(/^\*/u, "-"),
      footerPartial: preset.writer.footerPartial.replace(/^\*/gmu, "-"),
    },
  };
}
