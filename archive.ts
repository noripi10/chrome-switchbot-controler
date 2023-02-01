import archiver from 'archiver';
import fs from 'fs';

const zipFileName = 'dist.zip';

const execute = () => {
  if (fs.existsSync(`./${zipFileName}`)) {
    fs.unlinkSync(`./${zipFileName}`);
  }

  const archive = archiver.create('zip', {});
  const output = fs.createWriteStream(zipFileName);

  archive.pipe(output);
  archive.finalize();

  output.on('close', () => {
    const size = archive.pointer();
    console.info(`archive complete: ${zipFileName} file_size: ${size} bytes`);
  });
};

execute();
