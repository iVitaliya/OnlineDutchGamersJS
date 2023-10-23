import type {
  APIEmbed,
  APIEmbedAuthor,
  APIEmbedField,
  APIEmbedFooter,
  APIEmbedImage,
  APIEmbedProvider,
  APIEmbedThumbnail,
  APIEmbedVideo,
} from "discord.js";
import moment from "moment";

import type { RemoveField, ToArray } from "./index";
import { EmbedThemes, EmbedTypes } from "./index";

const EmbedLimits = {
  author: {
    name: 256,
  },
  title: 256,
  description: 4096,
  footer: {
    text: 2048,
  },
  field: {
    name: 256,
    value: 1024,
  },
  fields: 25,
};

export class MessageEmbed implements APIEmbed {
  theme: { icon: string; color: string };
  /**
   * Title of embed
   *
   * Length limit: 256 characters
   */
  title?: string;
  /**
   * Description of embed
   *
   * Length limit: 4096 characters
   */
  description?: string;
  /**
   * URL of embed
   */
  url?: string;
  /**
   * Timestamp of embed content
   */
  timestamp?: string;
  /**
   * Color code of the embed
   */
  color?: number;
  /**
   * Footer information
   *
   * See https://discord.com/developers/docs/resources/channel#embed-object-embed-footer-structure
   */
  footer?: APIEmbedFooter;
  /**
   * Image information
   *
   * See https://discord.com/developers/docs/resources/channel#embed-object-embed-image-structure
   */
  image?: APIEmbedImage;
  /**
   * Thumbnail information
   *
   * See https://discord.com/developers/docs/resources/channel#embed-object-embed-thumbnail-structure
   */
  thumbnail?: APIEmbedThumbnail;
  /**
   * Video information
   *
   * See https://discord.com/developers/docs/resources/channel#embed-object-embed-video-structure
   */
  video?: APIEmbedVideo;
  /**
   * Provider information
   *
   * See https://discord.com/developers/docs/resources/channel#embed-object-embed-provider-structure
   */
  provider?: APIEmbedProvider;
  /**
   * Author information
   *
   * See https://discord.com/developers/docs/resources/channel#embed-object-embed-author-structure
   */
  author?: APIEmbedAuthor;
  /**
   * Fields information
   *
   * Length limit: 25 field objects
   *
   * See https://discord.com/developers/docs/resources/channel#embed-object-embed-field-structure
   */
  fields?: APIEmbedField[];

  public constructor(theme: EmbedTypes) {
    this.theme = EmbedThemes[theme];
  }

  private fitData(str: string, length: number) {
    let s: string = (str.length > length) ? str.slice(0, length) : str;

    return s;
  }

  /**
   * Author information
   *
   * See https://discord.com/developers/docs/resources/channel#embed-object-embed-author-structure
   */
  public setAuthor(
    data: RemoveField<APIEmbedAuthor, "icon_url" | "proxy_icon_url">,
  ): MessageEmbed {
    this.author = {
      name: this.fitData(data.name, EmbedLimits.author.name),
      url: data.url,
      icon_url: this.theme.icon,
    };

    this.setColor(this.theme.color);

    return this;
  }

  /**
   * Thumbnail information
   *
   * See https://discord.com/developers/docs/resources/channel#embed-object-embed-thumbnail-structure
   */
  public setThumbnail(data: APIEmbedThumbnail): MessageEmbed {
    this.thumbnail = data;

    return this;
  }

  /**
   * Title of embed
   *
   * Length limit: 256 characters
   */
  public setTitle(title: string): MessageEmbed {
    this.title = this.fitData(title, EmbedLimits.title);

    return this;
  }

  /**
   * Description of embed
   *
   * Length limit: 4096 characters
   */
  public setDescription(description: string): MessageEmbed {
    this.description = this.fitData(description, EmbedLimits.description);

    return this;
  }

  /**
   * Image information
   *
   * See https://discord.com/developers/docs/resources/channel#embed-object-embed-image-structure
   */
  public setImage(data: APIEmbedImage): MessageEmbed {
    this.image = data;

    return this;
  }

  /**
   * Video information
   *
   * See https://discord.com/developers/docs/resources/channel#embed-object-embed-video-structure
   */
  public setVideo(data: APIEmbedVideo): MessageEmbed {
    this.video = data;

    return this;
  }

  /**
   * URL of embed
   */
  public setURL(url: string): MessageEmbed {
    this.url = url;

    return this;
  }

  /**
   * Fields information
   *
   * Length limit: 25 field objects
   *
   * See https://discord.com/developers/docs/resources/channel#embed-object-embed-field-structure
   */
  public addField(data: APIEmbedField): MessageEmbed {
    if (this.fields!.length === EmbedLimits.fields) {
      throw new Error(
        `The provided Embed already has ${EmbedLimits.fields} fields and thus you can't add any more fields as ${EmbedLimits.fields} is the maximum amount of fields you can assign to an embed!`,
      );
    }

    this.fields!.push({
      name: this.fitData(data.name, EmbedLimits.field.name),
      value: this.fitData(data.value, EmbedLimits.field.value),
      inline: data.inline ? data.inline : false,
    });

    return this;
  }

  /**
   * Fields information
   *
   * Length limit: 25 field objects
   *
   * See https://discord.com/developers/docs/resources/channel#embed-object-embed-field-structure
   */
  public setFields(data: ToArray<APIEmbedField>): MessageEmbed {
    if (this.fields!.length === EmbedLimits.fields) {
      throw new Error(
        `The provided Embed already has ${EmbedLimits.fields} fields and thus you can't add any more fields as ${EmbedLimits.fields} is the maximum amount of fields you can assign to an embed!`,
      );
    } else if (data.length > EmbedLimits.fields) {
      throw new Error(
        `You can't add more than ${EmbedLimits.fields} to an embed!`,
      );
    }

    for (const element of data) {
      this.fields!.push({
        name: this.fitData(element.name, EmbedLimits.field.name),
        value: this.fitData(element.value, EmbedLimits.field.value),
        inline: element.inline ? element.inline : false,
      });
    }

    return this;
  }

  /**
   * Color code of the embed
   */
  public setColor(color: string | number): MessageEmbed {
    this.color = (typeof color === "string")
      ? Number(color.replace("#", "0x"))
      : color;

    return this;
  }

  /**
   * Footer information
   *
   * See https://discord.com/developers/docs/resources/channel#embed-object-embed-footer-structure
   */
  public setFooter(data: APIEmbedFooter): MessageEmbed {
    this.footer = {
      text: this.fitData(data.text, EmbedLimits.footer.text),
      icon_url: data.icon_url,
      proxy_icon_url: data.proxy_icon_url,
    };

    return this;
  }

  /**
   * Timestamp of embed content
   */
  public setTimestamp(): MessageEmbed {
    this.timestamp = moment(Date.now()).format("Do [of] MMMM YYYY");

    return this;
  }

  /**
   * Provider information
   *
   * See https://discord.com/developers/docs/resources/channel#embed-object-embed-provider-structure
   */
  public setProvider(data: APIEmbedProvider): MessageEmbed {
    this.provider = data;

    return this;
  }

  public get build(): APIEmbed {
    return {
      author: this.author,
      thumbnail: this.thumbnail,
      title: this.title,
      description: this.description,
      image: this.image,
      video: this.video,
      url: this.url,
      fields: this.fields,
      color: this.color,
      footer: this.footer,
      timestamp: this.timestamp,
      provider: this.provider,
    };
  }
}
