import archiver from 'archiver';
import fs from 'fs';

const zipFileName = 'disp.zip';

const execute = () => {
  if (fs.existsSync('./disp.zip')) {
    fs.unlinkSync('./disp.zip');
    console.info('zip-file delete : disp.zip');
  }

  const archive = archiver.create('zip', {});
  const output = fs.createWriteStream(zipFileName);

  archive.pipe(output);
  archive.finalize();

  output.on('close', () => {
    const size = archive.pointer();
    console.info(`arichive complete : ${zipFileName} file_size : ${size} bytes`);
  });
};

execute();
