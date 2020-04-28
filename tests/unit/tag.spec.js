import { shallowMount, mount } from '@vue/test-utils'
import Tag from '@/components/Tag.vue'
import TagService from '../../src/services/TagService'

describe('Tag', () => {
  beforeAll(async () => {
    jest.mock('../../src/services/TagService')
    await TagService.list()
  });


  it('create method', async () => {
    const wrapper = mount(Tag)

    await wrapper.vm.loadTags();
    expect(wrapper.findAll('li').length).toBe(0)

    expect(wrapper.find('[data-tag-new]').exists())

    const input = wrapper.find('[data-tag-new]')
    await input.setValue('Flowers')
    expect(wrapper.vm.tag.name).toMatch('Flowers')

    await wrapper.vm.create();

    expect(wrapper.findAll('li').length).toBe(1)
    wrapper.destroy()
  })

  it('list method', async () => {
    const wrapper = mount(Tag)

    await wrapper.vm.loadTags();
    expect(wrapper.findAll('li').length).toBe(1)
  })

  it('update method', async () => {
    const wrapper = mount(Tag)

    await wrapper.vm.loadTags();
    expect(wrapper.findAll('li').length).toBe(1)

    const li = await wrapper.findAll('li').at(0);
    expect(li.find('button.update').exists())

    const buttonUpdate = li.find('button.update')
    await buttonUpdate.trigger('click')
    expect(wrapper.vm.edit).toBe(true)

    expect(wrapper.find('[data-tag-update]').exists())

    const input = wrapper.find('[data-tag-update]')
    await input.setValue('Dogs')
    expect(wrapper.vm.tag.name).toMatch('Dogs')

    await wrapper.vm.update(wrapper.vm.tags[0]._id);
    expect(wrapper.findAll('li').at(0).text().split(' ')[1]).toBe("Dogs")
    console.log(wrapper.vm.tags.length)
    wrapper.destroy()
  })

  it('delete method', async () => {
    const wrapper = mount(Tag)

    await wrapper.vm.loadTags();
    expect(wrapper.findAll('li').length).toBe(1)

    const li = await wrapper.findAll('li').at(0);
    expect(li.find('button.delete').exists())

    const buttonDelete = li.find('button.delete')
    await buttonDelete.trigger('click')
    await wrapper.vm.remove(wrapper.vm.tags[0]._id);
    expect(wrapper.findAll('li').length).toBe(0)

    console.log(wrapper.vm.tags.length)
    wrapper.destroy()
  })




})
