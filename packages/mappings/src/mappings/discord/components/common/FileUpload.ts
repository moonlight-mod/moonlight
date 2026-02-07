import register from "../../../../registry";

export type OAuth2Response = {
  application?: any;
  guild?: any;
  location: string;
};

export type FileFilter = {
  name: string;
  extensions: string[];
};

export type FileUploadProps = {
  buttonText: string;
  placeholder: string;
  onFileSelect: (file: File) => void;
  filename?: string;
  className?: string;
  filters: FileFilter[];
};

type Exports = {
  default: React.FC<FileUploadProps>;
};
export default Exports;

register((moonmap) => {
  const name = "discord/components/common/FileUpload";
  moonmap.register({
    name,
    find: ".currentTarget.files?.[0]",
    process({ id }) {
      moonmap.addModule(id, name);

      return true;
    }
  });
});
