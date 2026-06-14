import type { Metadata } from "next";
import { DocPage } from "@/components/docs/doc-page";
import { CodeBlock } from "@/components/docs/code";
import { Callout, H2, H3 } from "@/components/docs/mdx";

export const metadata: Metadata = { title: "Image input" };

export default function Page() {
  return (
    <DocPage
      eyebrow="SDK"
      title="Image input"
      description="Send images to the model — paste them with Ctrl+V in the CLI, or pass URLs, data URIs, file paths, and base64 to session.prompt() in the SDK."
    >
      <p>
        harnext accepts multimodal input. Interactively you paste an image from the
        clipboard; programmatically you pass images alongside the text prompt and
        harnext resolves each to the base64 form providers expect.
      </p>

      <H2>SDK: session.prompt(text, images)</H2>
      <p>
        <code>session.prompt()</code> takes an optional second argument — a list of{" "}
        <code>ImageInput</code> values. Each entry is one of four shapes:
      </p>
      <CodeBlock
        lang="ts"
        code={`type ImageInput =
  | ImageContent                      // { type: 'image', data: '<base64>', mimeType?: string }
  | { url: string; mimeType?: string } // http(s) URL or data: URI
  | string;                            // http(s) URL, data: URI, or local file path`}
      />
      <CodeBlock
        lang="ts"
        code={`import { createAgentSession, type ImageInput } from '@harnext/core';

const { session } = await createAgentSession({ provider, modelId });

await session.prompt('describe this', [
  { url: 'https://example.com/cat.png' },                    // http(s) → fetched
  'data:image/png;base64,iVBORw0KGgo…',                      // data: URI
  '/path/to/local.jpg',                                      // file path → read
  { type: 'image', data: '<b64>', mimeType: 'image/png' },   // raw base64
]);`}
      />

      <H3>How resolution works</H3>
      <ul>
        <li>
          <strong><code>resolveImages(inputs)</code></strong> (and the single{" "}
          <code>resolveImage(input)</code>) normalize every form to{" "}
          <code>ImageContent</code>: http(s) URLs are fetched, file paths are read,{" "}
          <code>data:</code> URIs are decoded, and the bytes are base64-encoded.
        </li>
        <li>
          <strong>MIME type</strong> is taken from the <code>data:</code> URI, the
          HTTP response, or the file extension — or the explicit{" "}
          <code>mimeType</code> you pass.
        </li>
        <li>
          <strong>Base64-only transport.</strong> pi-ai carries images as base64; each
          provider transform then emits the per-API shape. You always hand harnext
          source images; it deals with the wire format.
        </li>
        <li>
          <strong>Size cap.</strong> <code>MAX_IMAGE_BYTES</code> (20&nbsp;MB) bounds a
          single image, so an oversized input fails fast rather than at the provider.
        </li>
      </ul>
      <Callout type="note" title="Exports">
        From <code>@harnext/core</code>: <code>resolveImages</code>,{" "}
        <code>resolveImage</code>, the <code>ImageInput</code> and{" "}
        <code>ImageContent</code> types, and <code>MAX_IMAGE_BYTES</code>. Resolve and
        validate ahead of time if you want to surface errors before prompting.
      </Callout>

      <H2>CLI: paste with Ctrl+V</H2>
      <p>
        At the interactive prompt, <code>Ctrl+V</code> grabs an image from the system
        clipboard, base64-encodes it, and attaches it to your next message. A{" "}
        <code>🖼 N</code> chip in the footer shows how many images are pending, and{" "}
        <strong>image-only prompts</strong> (empty text) are allowed — paste and press
        enter.
      </p>
      <H3>Clipboard tools per OS</H3>
      <table>
        <thead>
          <tr>
            <th>OS</th>
            <th>Tool used</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>Linux</td><td><code>xclip</code> (X11) or <code>wl-paste</code> (Wayland)</td></tr>
          <tr><td>macOS</td><td><code>pngpaste</code>, falling back to <code>pbpaste</code></td></tr>
          <tr><td>Windows</td><td>PowerShell clipboard access</td></tr>
        </tbody>
      </table>
      <ul>
        <li>
          <strong>No image on the clipboard?</strong> <code>Ctrl+V</code> pastes the
          clipboard text instead, as usual.
        </li>
        <li>
          <strong>No clipboard tool installed?</strong> harnext prints a one-time hint
          on how to install one — never a silent failure.
        </li>
      </ul>

      <Callout type="note" title="Source">
        Multimodal input shipped in{" "}
        <a href="https://github.com/QualityUnit/harnext/pull/48">QualityUnit/harnext#48</a>.
        See the <a href="/blog/image-input">announcement post</a> for the why, and the{" "}
        <a href="/docs/sdk/reference">API reference</a> for the exported types.
      </Callout>
    </DocPage>
  );
}
