export default function UploadPlaceholder() {
  return (
    <>
      <div className="page-head">
        <div className="eyebrow">Add Pages</div>
        <h1>Upload</h1>
        <p>A built-in uploader is coming next. For now, add photos from Supabase directly.</p>
      </div>
      <div className="upload-box">
        <ol style={{ lineHeight: 1.8, paddingLeft: 20 }}>
          <li>Go to your Supabase project &rarr; Storage &rarr; your bucket.</li>
          <li>Click &ldquo;Upload files&rdquo; and choose your photos.</li>
          <li>
            Come back to <a href="/">Read</a> and refresh &mdash; they&rsquo;ll show up
            automatically.
          </li>
        </ol>
      </div>
    </>
  );
}
